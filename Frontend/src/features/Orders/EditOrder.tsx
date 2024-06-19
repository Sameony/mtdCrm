import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Button, Table, TextInput } from 'flowbite-react';
// import AutocompleteProductInput from '../../util/AutoCompleteProductInput';
import { orderApis } from '../../config/orderApi';
import { MdDelete } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';
import { FaChevronLeft } from 'react-icons/fa';
import Loading from '../../util/Loading';

interface Address {
    street: string;
    city: string;
    pin: string;
}

interface OrderFormState {
    customer: string;
    ship_method: string;
    ship_address: Address;
    comment: string;
    added_cost: number;
    discount: number;
    tax: number;
    amount_total: number;
    due_amount: number;
    paid_amount: number;
    status: string;
}

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
    product_size: Size;
    shipping_size: Size;
    weight: number;
    status: string;
    parentName: string;
    _id?: string;
    parent_id?: string;
}

const OrderForm: React.FC = () => {
    const [formState, setFormState] = useState<OrderFormState>({
        customer: '',
        ship_method: 'MTD Shipping',
        ship_address: {
            street: '',
            city: '',
            pin: ''
        },
        comment: '',
        added_cost: 0,
        discount: 0,
        tax: 0,
        amount_total: 0,
        due_amount: 0,
        paid_amount: 0,
        status: 'Processing'
    });
    const [selectedProducts, setSelectedProducts] = useState<(Child & { quantity: number })[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const params = useParams();
    const { id } = params;
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrderDetails();
    }, []);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true)
            const response = await orderApis.getOrderByID(id);
            console.log(response)
            if (response.data.status) {
                const order = response.data.data.order;
                const products = response.data.data.products;
                const customer = response.data.data.customer;

                // Pre-fill form state with fetched order details
                setFormState({
                    customer: customer.firstname + customer.lastname,
                    ship_method: order.ship_method,
                    ship_address: {
                        street: order.ship_address?.street,
                        city: order.ship_address?.city,
                        pin: order.ship_address?.pin
                    },
                    comment: order.comment,
                    added_cost: order.added_cost,
                    discount: order.discount,
                    tax: order.tax,
                    amount_total: order.amount_total,
                    due_amount: order.due_amount,
                    paid_amount: order.paid_amount,
                    status: order.status
                });

                // Pre-fill selected products with fetched products
                const preFilledProducts = products.map((prod: any) => ({
                    ...prod[0],
                    quantity: prod.quantity,
                    parentName: prod.parent_name
                }));

                setSelectedProducts(preFilledProducts);
                // Set customer name (assuming you have a way to fetch it by ID)
            }
        } catch (error: any) {
            toast.error(error.response.data.err);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        const paid = formState.amount_total - formState.due_amount
        let amt = selectedProducts.reduce((acc, curr) => {
            acc = Number(acc) + Number(curr.sale_price * curr.quantity);
            return acc;
        }, 0);
        // if (formState.added_cost)
        //     amt = Number(amt) + Number(formState.added_cost);
        if (formState.discount) {
            amt = Number(amt) - Number(formState.discount / 100) * amt;
        }

        setFormState({ ...formState, amount_total: amt, due_amount: amt - paid });
    }, [selectedProducts, formState.added_cost, formState.tax, formState.discount]);


    // const handleProductChange = (product: Child & { parentName: string }) => {
    //     if (!selectedProducts.some(p => p.SKU === product.SKU)) {
    //         setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    //     }
    //     setInputValue('');
    // };

    const handleQuantityChange = (SKU: string, quantity: number) => {
        setSelectedProducts(selectedProducts.map(product =>
            product.SKU === SKU ? { ...product, quantity } : product
        ));
    };

    const handleRemoveProduct = (SKU: string) => {
        setSelectedProducts(selectedProducts.filter(product => product.SKU !== SKU));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.includes('ship_address.')) {
            const addressField = name.split('.')[1];
            setFormState({
                ...formState,
                ship_address: {
                    ...formState.ship_address,
                    [addressField]: value.toUpperCase()
                }
            });
        } else {
            setFormState({
                ...formState,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true)
        try {
            let data = { comment: formState.comment, ship_method: formState.ship_method, ship_address: formState.ship_address, status: formState.status };
            let res = await orderApis.updateOrder(id, data);
            if (res.data.status) {
                toast.success("Order successfully updated.");
            } else {
                toast.error(res.data.err ?? "Something went wrong")
            }
        } catch (error: any) {
            toast.error(error.response.data.err);
        } finally {
            setLoading(false)
        }
    };

    return (
        loading?<Loading />:<form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-8 shadow-md rounded-lg">
            <div className='mb-6 flex items-center justify-between'>
                <h2 className="text-2xl font-semibold ">Edit Order</h2>
                <Button className='' color={'gray'} onClick={() => navigate(-1)}>
                    <span className='flex gap-2 items-center'><FaChevronLeft />Back</span>
                </Button>
            </div>

            {/* Customer select */}
            <div className="mb-4">
                <label htmlFor="customer" className="block text-sm font-medium text-gray-700 mb-2">Customer:</label>
                {/* <AutoCompleteCustomerInput
                    value={customerName}
                    onChange={handleCustomerChange}
                /> */}
                <TextInput value={formState.customer} disabled />
            </div>

            {/* Products add
            <label htmlFor="productsInput" className="block text-sm font-medium text-gray-700 mb-2">Add Products:</label>
            <AutocompleteProductInput value={inputValue} onChange={handleProductChange} /> */}

            {/* Product list */}
            <label htmlFor="productsListing" className="block text-sm font-medium text-gray-700 my-2"></label>
            <div className="my-4">
                {selectedProducts.length > 0 && (
                    <div className="overflow-x-auto">
                        <Table className="min-w-full bg-white border border-gray-300">
                            <Table.Head>
                                <Table.HeadCell>Product</Table.HeadCell>
                                <Table.HeadCell>SKU</Table.HeadCell>
                                <Table.HeadCell>Quantity</Table.HeadCell>
                                <Table.HeadCell></Table.HeadCell>
                            </Table.Head>
                            <Table.Body>
                                {selectedProducts.map((product, index) => (
                                    <Table.Row key={product.SKU}>
                                        <Table.Cell>{product.parentName}  {product.name}</Table.Cell>
                                        <Table.Cell>{product.SKU}</Table.Cell>
                                        <Table.Cell>
                                            <TextInput
                                                disabled
                                                type="number"
                                                value={product.quantity}
                                                min="1"
                                                onChange={(e) => handleQuantityChange(product.SKU, parseInt(e.target.value))}
                                                className="w-16"
                                            />
                                        </Table.Cell>
                                        <Table.Cell className="text-2xl text-red-500">
                                            {index > 0 && <MdDelete onClick={() => handleRemoveProduct(product.SKU)} />}
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </div>
                )}
            </div>

            <div className="mb-4">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">Ship Method:</label>
                <select
                    id="ship_method"
                    name="ship_method"
                    value={formState.ship_method}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="MTD Shipping">MTD Shipping</option>
                    <option value="Store Pickup">Store Pickup</option>
                </select>
            </div>

            {formState.ship_method === "MTD Shipping" && <>
                <div className="mb-4">
                    <label htmlFor="ship_address.street" className="block text-sm font-medium text-gray-700 mb-2">Street:</label>
                    <input
                        id="ship_address.street"
                        name="ship_address.street"
                        value={formState.ship_address.street}
                        onChange={handleInputChange}
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="ship_address.city" className="block text-sm font-medium text-gray-700 mb-2">City:</label>
                    <input
                        id="ship_address.city"
                        name="ship_address.city"
                        value={formState.ship_address.city}
                        onChange={handleInputChange}
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="ship_address.pin" className="block text-sm font-medium text-gray-700 mb-2">PIN:</label>
                    <input
                        id="ship_address.pin"
                        name="ship_address.pin"
                        value={formState.ship_address.pin}
                        onChange={handleInputChange}
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </>}

            <div className="mb-4">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">Comment:</label>
                <textarea
                    id="comment"
                    name="comment"
                    value={formState.comment}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            {/* <div className="mb-4">
                <label htmlFor="added_cost" className="block text-sm font-medium text-gray-700 mb-2">Added Cost:</label>
                <input
                    disabled
                    id="added_cost"
                    name="added_cost"
                    type="number"
                    value={formState.added_cost}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
            </div> */}

            {/* <div className="mb-4">
                <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-2">Discount:</label>
                <input
                    id="discount"
                    name="discount"
                    type="number"
                    value={formState.discount}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
            </div> */}

            <div className="mb-4">
                <label htmlFor="tax" className="block text-sm font-medium text-gray-700 mb-2">Tax:</label>
                <input
                    id="tax"
                    name="tax"
                    type="number"
                    value={formState.tax}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <div className="flex items-center justify-between">
                <div className="mb-4">
                    <label htmlFor="amount_total" className="block text-sm font-medium text-gray-700 mb-2">Total Amount:</label>
                    <TextInput
                        disabled
                        id="amount_total"
                        name="amount_total"
                        type="number"
                        value={formState.amount_total}
                        onChange={handleInputChange}
                        required
                    // className=" w-full"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="due_amount" className="block text-sm font-medium text-gray-700 mb-2">Due Amount:</label>
                    <TextInput
                        disabled
                        id="due_amount"
                        name="due_amount"
                        type="number"
                        value={formState.due_amount}
                        onChange={handleInputChange}
                        required
                    // className=" w-full"
                    />
                </div>
            </div>

            {/* <div className="mb-4">
                <label htmlFor="paid_amount" className="block text-sm font-medium text-gray-700 mb-2">Paid Amount:</label>
                <input
                    id="paid_amount"
                    name="paid_amount"
                    type="number"
                    value={formState.paid_amount}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
            </div> */}

            <div className="mb-4">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">Status:</label>
                <select
                    id="status"
                    name="status"
                    value={formState.status}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="Processing">Processing</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Refund Initiated">Refund Initiated</option>
                    <option value="Refund Completed">Refund Completed</option>

                </select>
            </div>

            <div className="flex justify-between gap-4 items-center">
                <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200">
                    Update Order
                </button>
                <button onClick={() => navigate(`/orders/${id}/payment`)} className="w-full bg-green-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring focus:ring-indigo-200">
                    Transaction Record
                </button>
            </div>
        </form>
    );
};

export default OrderForm;
