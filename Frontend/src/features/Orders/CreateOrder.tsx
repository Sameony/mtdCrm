import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Table, TextInput } from 'flowbite-react';
import AutoCompleteCustomerInput from '../../util/AutoCompleteCustomerInput';
import AutocompleteProductInput from '../../util/AutoCompleteProductInput';
import { orderApis } from '../../config/orderApi';
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

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
  const [inputValue, setInputValue] = useState('');
  // const [loading, setLoading] = useState<boolean>(false)
  const [customerName, setCustomerName] = useState('');
  const navigate = useNavigate()

  useEffect(() => {
    // handle amount change
    let amt = selectedProducts.reduce((acc, curr) => {
      acc = Number(acc) + Number(curr.sale_price * curr.quantity);
      return acc;
    }, 0)
    if (formState.added_cost)
      amt = Number(amt) + Number(formState.added_cost)
    if (formState.discount) {
      amt = Number(amt) - Number(formState.discount / 100) * amt
    }

    setFormState({ ...formState, amount_total: amt, due_amount: amt })
    // console.log(selectedProducts)
  }, [selectedProducts, formState.added_cost, formState.tax, formState.discount])

  const handleProductChange = (product: Child & { parentName: string }) => {
    if (!selectedProducts.some(p => p.SKU === product.SKU)) {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
    setInputValue('');
  };

  const handleQuantityChange = (SKU: string, quantity: number) => {
    setSelectedProducts(selectedProducts.map(product =>
      product.SKU === SKU ? { ...product, quantity } : product
    ));
  };

  const handleRemoveProduct = (SKU: string) => {
    // console.log(selectedProducts)
    setSelectedProducts(selectedProducts.filter(product => product.SKU !== SKU));
  };

  const handleCustomerChange = (customerId: string, customerName: string) => {
    setFormState({ ...formState, customer: customerId });
    setCustomerName(customerName);
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
    if (selectedProducts.length < 1) {
      toast.info("Please add products first.")
      return;
    } else if (!formState.customer) {
      toast.info("Please select a customer.")
      return;
    } else if (formState.ship_method !== "Store Pickup") {
      if (!formState.ship_address.city || !formState.ship_address.pin || !formState.ship_address.street)
        toast.info("Please provide complete shipping address")
      return;
    }
    try {
      const { ship_address, ...formdata } = formState;
      let data = {
        ...formdata,
        ...(formState.ship_method !== "Store Pickup" ? ship_address : {}),
        products: selectedProducts.map(item => {
          console.log(item)
          return { SKU: item.SKU, quantity: item.quantity, product_id: item.parent_id }
        })
      }
      let res = await orderApis.createOrder(data)
      // console.log(data)
      if (res.data.status) {
        toast.success("Order successfully created.")
        navigate(`/orders/${res.data.data._id}/payment`)
      }
    } catch (error) {
      toast.error("Something went wrong.")
    }
    console.log(formState, "----\n---", selectedProducts);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-8 shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">Create Order</h2>

      {/* Customer select */}
      <div className="mb-4">
        <label htmlFor="customer" className="block text-sm font-medium text-gray-700 mb-2">Customer:</label>
        <AutoCompleteCustomerInput
          value={customerName}
          onChange={handleCustomerChange}
        />
      </div>

      {/* Products add */}
      <label htmlFor="productsInput" className="block text-sm font-medium text-gray-700 mb-2">Add Products:</label>
      <AutocompleteProductInput value={inputValue} onChange={handleProductChange} />

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
                {selectedProducts.map(product => (
                  <Table.Row key={product.SKU}>
                    <Table.Cell>{product.parentName} - {product.name}</Table.Cell>
                    <Table.Cell>{product.SKU}</Table.Cell>
                    <Table.Cell>
                      <input
                        type="number"
                        value={product.quantity}
                        min="1"
                        onChange={(e) => handleQuantityChange(product.SKU, parseInt(e.target.value))}
                        className="w-16 px-2 py-1 border rounded-md"
                      />
                    </Table.Cell>
                    <Table.Cell className="text-2xl text-red-500">
                      <MdDelete onClick={() => handleRemoveProduct(product.SKU)} />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        )}
      </div>

      {/* ship method prolly */}

      <div className="mb-4">
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">Status:</label>
        <select
          id="ship_method"
          name="ship_method"
          value={formState.ship_method}
          onChange={handleInputChange}
          required
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
        >
          <option value="MTD Shipping">MTD Shipping</option>
          <option value="Store Pickup">Store Pickup</option>
        </select>
      </div>

      {/* Address start */}

      {formState.ship_method === "MTD Shipping" && <>
        <div className="mb-4">
          <label htmlFor="ship_address.street" className="block text-sm font-medium text-gray-700 mb-2">Street:</label>
          <input
            type="text"
            id="ship_address.street"
            name="ship_address.street"
            value={formState.ship_address.street}
            onChange={handleInputChange}
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="ship_address.city" className="block text-sm font-medium text-gray-700 mb-2">City:</label>
          <input
            type="text"
            id="ship_address.city"
            name="ship_address.city"
            value={formState.ship_address.city}
            onChange={handleInputChange}
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="ship_address.pin" className="block text-sm font-medium text-gray-700 mb-2">Pin:</label>
          <input
            type="text"
            id="ship_address.pin"
            name="ship_address.pin"
            value={formState.ship_address.pin}
            onChange={handleInputChange}
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
          />
        </div>
      </>}

      {/* address end */}

      <div className="mb-4">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">Comment:</label>
        <textarea
          id="comment"
          name="comment"
          value={formState.comment}
          onChange={handleInputChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-4">
          <label htmlFor="added_cost" className="block text-sm font-medium text-gray-700 mb-2">Added Cost:</label>
          <input
            type="number"
            id="added_cost"
            name="added_cost"
            min={0}
            value={formState.added_cost}
            onChange={handleInputChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-2">{`Discount(%)`}:</label>
          <input
            type="number"
            id="discount"
            name="discount"
            min={0}
            max={70}
            value={formState.discount}
            onChange={handleInputChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="tax" className="block text-sm font-medium text-gray-700 mb-2">Tax:</label>
          <input
            type="number"
            id="tax"
            name="tax"
            min={0}
            value={formState.tax}
            onChange={handleInputChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="amount_total" className="block text-sm font-medium text-gray-700 mb-2">Total Amount:</label>
          <TextInput
            type="number"
            disabled
            id="amount_total"
            name="amount_total"
            value={formState.amount_total}
            onChange={handleInputChange}
          />
        </div>

        {/* <div className="mb-4">
          <label htmlFor="due_amount" className="block text-sm font-medium text-gray-700 mb-2">Due Amount:</label>
          <input
            type="number"
            id="due_amount"
            name="due_amount"
            value={formState.due_amount}
            onChange={handleInputChange}
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
          />
        </div> */}

        {/* <div className="mb-4">
          <label htmlFor="paid_amount" className="block text-sm font-medium text-gray-700 mb-2">Paid Amount:</label>
          <input
            type="number"
            id="paid_amount"
            name="paid_amount"
            value={formState.paid_amount}
            onChange={handleInputChange}
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
          />
        </div> */}
      </div>

      {/* <div className="mb-4">
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">Status:</label>
        <select
          id="status"
          name="status"
          value={formState.status}
          onChange={handleInputChange}
          required
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
        >
          <option value="Processing">Processing</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Refund Initiated">Refund Initiated</option>
          <option value="Refund Completed">Refund Completed</option>
        </select>
      </div> */}

      <button
        type="submit"
        // disabled={selectedProducts.length < 1}
        className={`w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200`}
      >
        Proceed to Payments
      </button>
    </form>
  );
};

export default OrderForm;
