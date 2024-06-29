import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Table, TextInput, Select, Label, FileInput } from 'flowbite-react';
import { MdDelete, MdImageNotSupported } from 'react-icons/md';
import { FaChevronLeft } from 'react-icons/fa';
import { orderApis } from '../../config/orderApi';  // Adjust the import path according to your project structure
import Loading from '../../util/Loading';
import AutocompleteSupplier from '../../util/AutoCompleteSupplier';
import { FaChevronRight, FaPencil } from 'react-icons/fa6';
import { Child } from '../../config/models/Child';
import { apiUrl } from '../../config/api/apiUrl';
import BulkUpload from '../../util/BulkUpload';
import { Supplier } from '../../config/models/supplier';

interface Size {
    L: number;
    W: number;
    H: number;
}


interface ProductFormState {
    name: string;
    category: string;
    ID: string;
    children: Child[];
    supplier?: Supplier;
}

const MAX_FILE_SIZE = 1 * 1024 * 1024

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
        status: 'in stock',
        image: null,
        imageUrl: ""
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [bulkUpload, setBulkUpload] = useState<boolean>(false);



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
    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file && file.size > MAX_FILE_SIZE)
            toast.error("File size exceeds 1MB.")
        else if (file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                toast.error("Only JPEG, PNG, and GIF images are allowed.");
                return;
            }
            saveImageFile(file);
        }
    };
    const saveImageFile = (file: File) => {
        const imageUrl = URL.createObjectURL(file);
        console.log(file)
        setChildState(prev => ({ ...prev, image: file, imageUrl: imageUrl }));
    };

    const handleSupplierSelect = (supplier: Supplier) => {
        setFormState((prevState) => ({
            ...prevState,
            supplier: supplier
        }));
    };
    console.log(formState.supplier)
    const addChild = () => {
        if (!childState.SKU || !childState.color || !childState.cost_price || !childState.name || !childState.sale_price || !childState.selling_price) {
            toast.info("Please fill the required fields before adding")
            return;
        }
        let existing = formState.children.findIndex(child => child.SKU === childState.SKU)
        if (existing > -1) {
            let cloneFormStateChildren = formState.children
            cloneFormStateChildren[existing] = childState
            console.log(cloneFormStateChildren, childState, existing)
            setFormState({ ...formState, children: cloneFormStateChildren })
        }
        else {
            setFormState({ ...formState, children: [...formState.children, childState] });
        }
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

    const editChild = (SKU: Child) => {
        // console.log(SKU)
        setChildState(SKU)
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();

            // Append main product data
            formData.append('productData', JSON.stringify({
                name: formState.name,
                category: formState.category,
                ID: formState.ID,
                supplier: formState.supplier
            }));

            // Append children data and images
            const childrenDataArray = formState.children.map(child => ({
                ...child,
                image: undefined  // Remove image from JSON data
            }));
            formData.append('childrenData', JSON.stringify(childrenDataArray));

            // Append images
            formState.children.forEach((child) => {
                if (child.image instanceof File) {
                    const fileExtension = child.image.name.split('.').pop() || '';
                    formData.append(`childrenImages`, child.image, `${child.SKU}.${fileExtension}`);
                }
            });


            let res = id
                ? await orderApis.updateProduct(id, formData)
                : await orderApis.createProduct(formData);

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
        loading ? <Loading /> : bulkUpload ? <BulkUpload setLoading={setLoading} setBulkUpload={setBulkUpload} isSupplier={false} /> : <form onSubmit={handleSubmit} className="max-w-5xl mx-auto bg-white p-8 shadow-md rounded-lg">

            <div className='mb-6 flex items-center justify-between'>
                <Button color='gray' onClick={() => navigate(-1)}>
                    <span className='flex gap-2 items-center'><FaChevronLeft />Back</span>
                </Button>
                <h2 className="text-2xl font-semibold ">{id ? "Edit Product" : "Add Product"}</h2>
                {id?<p></p>:<Button color='gray' onClick={() => setBulkUpload(true)}>
                    <span className='flex gap-2 items-center'>Upload Multiple<FaChevronRight /></span>
                </Button>}
            </div>

            <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2"><span className='text-red-500'>*</span>Product Name:</label>
                <TextInput
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleInputChange}
                    required={formState.children.length < 1}
                />
            </div>

            {/* <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2"><span className='text-red-500'>*</span>Category:</label>
                <TextInput
                    id="category"
                    name="category"
                    value={formState.category}
                    onChange={handleInputChange}
                    required={formState.children.length < 1}
                />
            </div> */}
            <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2"><span className='text-red-500'>*</span>Category:</label>
                <select
                    id="category"
                    name="category"
                    value={formState.category}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
                >
                    <option value="">Select a category</option>
                    <option value="SOFA">SOFA</option>
                    <option value="MATTRESS">MATTRESS</option>
                    <option value="CABINET">CABINET</option>
                    <option value="BEDSHEET">BEDSHEET</option>
                </select>
            </div>

            <div className="mb-4">
                <label htmlFor="ID" className="block text-sm font-medium text-gray-700 mb-2"><span className='text-red-500'>*</span>Product ID:</label>
                <TextInput
                    id="ID"
                    name="ID"
                    value={formState.ID}
                    onChange={handleInputChange}
                    required={formState.children.length < 1}
                />
            </div>

            <div className="mb-4">
                <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-2"><span className='text-red-500'>*</span>Supplier:</label>
                <AutocompleteSupplier onSelect={handleSupplierSelect} value={formState.supplier || undefined} />
            </div>

            <hr className='my-6' />

            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="SKU" className="block text-sm font-medium text-gray-700 mb-2"><span className='text-red-500'>*</span>SKU:</label>
                    <TextInput
                        id="SKU"
                        name="SKU"
                        value={childState.SKU}
                        onChange={handleChildInputChange}
                        required={formState.children.length < 1}
                    />
                </div>
                <div>
                    <label htmlFor="child_name" className="block text-sm font-medium text-gray-700 mb-2"><span className='text-red-500'>*</span>Child Name:</label>
                    <TextInput
                        id="child_name"
                        name="name"
                        value={childState.name}
                        onChange={handleChildInputChange}
                        required={formState.children.length < 1}
                    />
                </div>
                <div>
                    <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2"><span className='text-red-500'>*</span>Color:</label>
                    <TextInput
                        id="color"
                        name="color"
                        value={childState.color}
                        onChange={handleChildInputChange}
                        required={formState.children.length < 1}
                    />
                </div>
                <div>
                    <label htmlFor="selling_price" className="block text-sm font-medium text-gray-700 mb-2"><span className='text-red-500'>*</span>Selling Price:</label>
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
                    <label htmlFor="sale_price" className="block text-sm font-medium text-gray-700 mb-2"><span className='text-red-500'>*</span>Sale Price:</label>
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
                    <label htmlFor="cost_price" className="block text-sm font-medium text-gray-700 mb-2"><span className='text-red-500'>*</span>Cost Price:</label>
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
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2"><span className='text-red-500'>*</span>Status:</label>
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
                <div className="flex col-span-2 w-full items-center justify-center">
                    <Label
                        htmlFor="dropzone-file"
                        className="flex h-64 w-full object-contain cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                        onDragOver={(e) => {
                            e.preventDefault();
                            // Add styles to indicate hovering over drop zone
                            e.currentTarget.classList.add('border-blue-500'); // Example class for highlighting
                        }}
                        onDragLeave={(e) => {
                            // Remove styles when leaving drop zone
                            e.currentTarget.classList.remove('border-blue-500');
                        }}
                        onDrop={(e) => {
                            e.preventDefault();
                            const files = Array.from(e.dataTransfer.files);
                            saveImageFile(files[0]); // Implement this function to handle dropped files
                            // Remove styles after dropping
                            e.currentTarget.classList.remove('border-blue-500');
                        }}
                    >
                        {childState.image ? <img className=' max-h-full object-contain' src={`${childState.image.path ? apiUrl.base + "/" + childState.image.path : childState.imageUrl}`} alt="Uploaded" /> : <div className="flex flex-col items-center justify-center pb-6 pt-5">
                            <svg
                                className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 16"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                        </div>}
                        <FileInput accept='image/*' id="dropzone-file" className="hidden" onChange={handleFileInputChange} />
                    </Label>
                </div>
                <div className="flex justify-end col-span-full">
                    <Button color="success" onClick={addChild}>
                        Add Child
                    </Button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <Table className="mb-4">
                    <Table.Head>
                        <Table.HeadCell>SKU</Table.HeadCell>
                        <Table.HeadCell>Name</Table.HeadCell>
                        <Table.HeadCell>Color</Table.HeadCell>
                        <Table.HeadCell>Selling Price</Table.HeadCell>
                        <Table.HeadCell>Sale Price</Table.HeadCell>
                        <Table.HeadCell>Cost Price</Table.HeadCell>
                        <Table.HeadCell>Image</Table.HeadCell>
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
                                <Table.Cell>{child.image ? <img className='w-20 ' src={`${child.image.path ? apiUrl.base + "/" + child.image.path : child.imageUrl}`} alt="Uploaded" /> : <MdImageNotSupported className='h-7 w-7' />}</Table.Cell>
                                <Table.Cell className='flex items-stretch justify-between'>
                                    <Button
                                        color={'success'}
                                        size="xs"
                                        className='mx-1'
                                        onClick={() => editChild(child)}
                                    >
                                        <FaPencil />
                                    </Button>
                                    <Button
                                        color="failure"
                                        size="xs"
                                        className='mx-1'
                                        onClick={() => removeChild(child.SKU)}
                                    >
                                        <MdDelete />
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>

            <div className="flex justify-end">
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-200 flex items-center"
                    type="submit">
                    {id ? "Update Product" : "Create Product"}
                </button>
            </div>
        </form>
    );
};

export default ProductForm;
