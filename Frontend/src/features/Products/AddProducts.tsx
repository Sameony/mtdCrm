import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Table, TextInput, Select } from 'flowbite-react';
import { MdDelete } from 'react-icons/md';
import { FaChevronLeft } from 'react-icons/fa';
import { orderApis } from '../../config/orderApi';  // Adjust the import path according to your project structure
import Loading from '../../util/Loading';
import AutocompleteSupplier from '../../util/AutoCompleteSupplier';
interface Size {
    L: number;
    W: number;
    H: number;
}

interface Child {
    SKU: string;
    name: string;
    color: string;
    selling_price: number;
    sale_price: number;
    cost_price: number;
    product_size?: Size;
    shipping_size?: Size;
    weight?: number;
    status: string;
}

interface Supplier {
    supplier_id: string;
    name: string;
}

interface ProductFormState {
    name: string;
    category: string;
    ID: string;
    children: Child[];
    supplier?: Supplier;
}

const ProductForm: React.FC = () => {
    const [formState, setFormState] = useState<ProductFormState>({
        name: '',
        category: '',
        ID: '',
        children: [],
        supplier: undefined
    });
    const [childState, setChildState] = useState<Child>({
        SKU: '',
        name: '',
        color: '',
        selling_price: 0,
        sale_price: 0,
        cost_price: 0,
        status: 'in stock'
    });
    const [loading, setLoading] = useState<boolean>(false);
    const params = useParams<{ id?: string }>();
    const { id } = params;
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            fetchProductDetails(id);
        }
    }, [id]);

    const fetchProductDetails = async (productId: string) => {
        setLoading(true);
        try {
            const response = await orderApis.getProductById(productId);
            if (response.data.status) {
                setFormState(response.data.data);
            }
        } catch (error: any) {
            toast.error(error.response.data.err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        let { name, value } = e.target;
        if (typeof value === "string")
            value = value.toUpperCase();
        setFormState({ ...formState, [name]: value });
    };

    const handleChildInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        let { name, value } = e.target;
        const [field, subfield] = name.split(".");
        if (typeof value === "string" && name !== "status")
            value = value.toUpperCase();
        if (subfield) {
            setChildState((prevState) => ({
                ...prevState,
                [field]: {
                    ...(prevState[field as 'product_size' | 'shipping_size'] as Size),
                    [subfield]: parseFloat(value)
                }
            }));
        } else {
            setChildState((prevState) => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSupplierSelect = (supplier: Supplier) => {
        setFormState((prevState) => ({
            ...prevState,
            supplier: supplier
        }));
    };

    const addChild = () => {
        setFormState({ ...formState, children: [...formState.children, childState] });
        setChildState({
            SKU: '',
            name: '',
            color: '',
            selling_price: 0,
            sale_price: 0,
            cost_price: 0,
            product_size: { L: 0, W: 0, H: 0 },
            shipping_size: { L: 0, W: 0, H: 0 },
            weight: 0,
            status: 'in stock'
        });
    };

    const removeChild = (SKU: string) => {
        setFormState({ ...formState, children: formState.children.filter(child => child.SKU !== SKU) });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            let res = id ? await orderApis.updateProduct(id, formState) : await orderApis.createProduct(formState);
            if (res.data.status) {
                navigate('/products');
                id ? toast.success("Product successfully updated.") : toast.success("Product successfully created.");
            } else {
                toast.error("Something went wrong. Please try again after some time.");
            }

        } catch (error) {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        loading ? <Loading /> : <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white p-8 shadow-md rounded-lg">
            <div className='mb-6 flex items-center justify-between'>
                <h2 className="text-2xl font-semibold ">{id ? "Edit Product" : "Add Product"}</h2>
                <Button color='gray' onClick={() => navigate(-1)}>
                    <span className='flex gap-2 items-center'><FaChevronLeft />Back</span>
                </Button>
            </div>

            <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Product Name:</label>
                <TextInput
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleInputChange}
                    required={formState.children.length < 1}
                />
            </div>

            <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Category:</label>
                <TextInput
                    id="category"
                    name="category"
                    value={formState.category}
                    onChange={handleInputChange}
                    required={formState.children.length < 1}
                />
            </div>

            <div className="mb-4">
                <label htmlFor="ID" className="block text-sm font-medium text-gray-700 mb-2">Product ID:</label>
                <TextInput
                    id="ID"
                    name="ID"
                    value={formState.ID}
                    onChange={handleInputChange}
                    required={formState.children.length < 1}
                />
            </div>

            <div className="mb-4">
                <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-2">Supplier:</label>
                <AutocompleteSupplier onSelect={handleSupplierSelect} value={formState.supplier || null} />
            </div>

            <hr className='my-6' />

            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="SKU" className="block text-sm font-medium text-gray-700 mb-2">SKU:</label>
                    <TextInput
                        id="SKU"
                        name="SKU"
                        value={childState.SKU}
                        onChange={handleChildInputChange}
                        required={formState.children.length < 1}
                    />
                </div>
                <div>
                    <label htmlFor="child_name" className="block text-sm font-medium text-gray-700 mb-2">Child Name:</label>
                    <TextInput
                        id="child_name"
                        name="name"
                        value={childState.name}
                        onChange={handleChildInputChange}
                        required={formState.children.length < 1}
                    />
                </div>
                <div>
                    <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">Color:</label>
                    <TextInput
                        id="color"
                        name="color"
                        value={childState.color}
                        onChange={handleChildInputChange}
                        required={formState.children.length < 1}
                    />
                </div>
                <div>
                    <label htmlFor="selling_price" className="block text-sm font-medium text-gray-700 mb-2">Selling Price:</label>
                    <TextInput
                        id="selling_price"
                        name="selling_price"
                        type="number"
                        min={0}
                        value={childState.selling_price}
                        onChange={handleChildInputChange}
                        required={formState.children.length < 1}
                    />
                </div>
                <div>
                    <label htmlFor="sale_price" className="block text-sm font-medium text-gray-700 mb-2">Sale Price:</label>
                    <TextInput
                        id="sale_price"
                        name="sale_price"
                        type="number"
                        min={0}
                        value={childState.sale_price}
                        onChange={handleChildInputChange}
                        required={formState.children.length < 1}
                    />
                </div>
                <div>
                    <label htmlFor="cost_price" className="block text-sm font-medium text-gray-700 mb-2">Cost Price:</label>
                    <TextInput
                        id="cost_price"
                        name="cost_price"
                        type="number"
                        min={0}
                        value={childState.cost_price}
                        onChange={handleChildInputChange}
                        required={formState.children.length < 1}
                    />
                </div>
                <div>
                    <label htmlFor="product_size.L" className="block text-sm font-medium text-gray-700 mb-2">Product Size L:</label>
                    <TextInput
                        id="product_size.L"
                        name="product_size.L"
                        type="number"
                        min={0}
                        value={childState.product_size?.L}
                        onChange={handleChildInputChange}

                    />
                </div>
                <div>
                    <label htmlFor="product_size.W" className="block text-sm font-medium text-gray-700 mb-2">Product Size W:</label>
                    <TextInput
                        id="product_size.W"
                        name="product_size.W"
                        type="number"
                        min={0}
                        value={childState.product_size?.W}
                        onChange={handleChildInputChange}

                    />
                </div>
                <div>
                    <label htmlFor="product_size.H" className="block text-sm font-medium text-gray-700 mb-2">Product Size H:</label>
                    <TextInput
                        id="product_size.H"
                        name="product_size.H"
                        type="number"
                        min={0}
                        value={childState.product_size?.H}
                        onChange={handleChildInputChange}

                    />
                </div>
                <div>
                    <label htmlFor="shipping_size.L" className="block text-sm font-medium text-gray-700 mb-2">Shipping Size L:</label>
                    <TextInput
                        id="shipping_size.L"
                        name="shipping_size.L"
                        type="number"
                        min={0}
                        value={childState.shipping_size?.L}
                        onChange={handleChildInputChange}

                    />
                </div>
                <div>
                    <label htmlFor="shipping_size.W" className="block text-sm font-medium text-gray-700 mb-2">Shipping Size W:</label>
                    <TextInput
                        id="shipping_size.W"
                        name="shipping_size.W"
                        type="number"
                        min={0}
                        value={childState.shipping_size?.W}
                        onChange={handleChildInputChange}

                    />
                </div>
                <div>
                    <label htmlFor="shipping_size.H" className="block text-sm font-medium text-gray-700 mb-2">Shipping Size H:</label>
                    <TextInput
                        id="shipping_size.H"
                        name="shipping_size.H"
                        type="number"
                        min={0}
                        value={childState.shipping_size?.H}
                        onChange={handleChildInputChange}

                    />
                </div>

                <div>
                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">Weight:</label>
                    <TextInput
                        id="weight"
                        name="weight"
                        type="number"
                        min={0}
                        value={childState.weight}
                        onChange={handleChildInputChange}

                    />
                </div>
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">Status:</label>
                    <Select
                        id="status"
                        name="status"
                        value={childState.status}
                        onChange={handleChildInputChange}
                        required={formState.children.length < 1}
                    >
                        <option value="in stock">In Stock</option>
                        <option value="out of stock">Out of Stock</option>
                        <option value="discontinued">Discontinued</option>
                    </Select>
                </div>
                <div className="flex justify-end col-span-full">
                    <Button color="success" onClick={addChild}>
                        Add Child
                    </Button>
                </div>
            </div>

            <Table className="mb-4">
                <Table.Head>
                    <Table.HeadCell>SKU</Table.HeadCell>
                    <Table.HeadCell>Name</Table.HeadCell>
                    <Table.HeadCell>Color</Table.HeadCell>
                    <Table.HeadCell>Selling Price</Table.HeadCell>
                    <Table.HeadCell>Sale Price</Table.HeadCell>
                    <Table.HeadCell>Cost Price</Table.HeadCell>
                    <Table.HeadCell>Actions</Table.HeadCell>
                </Table.Head>
                <Table.Body>
                    {formState.children.map((child, index) => (
                        <Table.Row key={index}>
                            <Table.Cell>{child.SKU}</Table.Cell>
                            <Table.Cell>{child.name}</Table.Cell>
                            <Table.Cell>{child.color}</Table.Cell>
                            <Table.Cell>{child.selling_price}</Table.Cell>
                            <Table.Cell>{child.sale_price}</Table.Cell>
                            <Table.Cell>{child.cost_price}</Table.Cell>
                            <Table.Cell>
                                <Button
                                    color="failure"
                                    size="xs"
                                    onClick={() => removeChild(child.SKU)}
                                >
                                    <MdDelete />
                                </Button>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>

            <div className="flex justify-end">
                <button  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-200 flex items-center"
                 type="submit">
                    {id ? "Update Product" : "Create Product"}
                </button>
            </div>
        </form>
    );
};

export default ProductForm;
