import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Button, Table, TextInput, ToggleSwitch } from 'flowbite-react';
import AutoCompleteCustomerInput from '../../util/AutoCompleteCustomerInput';
import { orderApis } from '../../config/orderApi';
import { MdDelete } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../../util/Loading';
import AutocompleteProductInput from '../../util/AutoCompleteProductInput';
import { FaChevronLeft } from 'react-icons/fa';

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
  sub_total: number;
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

const OrderForm= () => {
  const { id } = useParams<{ id: string }>(); // Get the ID from the URL parameters
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
    sub_total: 0,
    status: 'Processing',
  });
  const [selectedProducts, setSelectedProducts] = useState<(Child & { quantity: number })[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [customerName, setCustomerName] = useState('');
  const [hasTax, setHasTax] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id]);



  useEffect(() => {
    const subTotal = calculateSubTotal(selectedProducts);
    setFormState((prevState) => ({
      ...prevState,
      sub_total: subTotal,
    }));
  }, [selectedProducts]);

  useEffect(() => {
    const tax = calculateTax(formState.sub_total, formState.added_cost, hasTax);
    setFormState((prevState) => ({
      ...prevState,
      tax: Number(tax),
    }));
  }, [hasTax, formState.sub_total, formState.added_cost]);

  useEffect(() => {
    const totalAmount = calculateTotalAmount(
      formState.sub_total,
      formState.added_cost,
      formState.tax,
      formState.discount
    );
    setFormState((prevState) => ({
      ...prevState,
      amount_total: totalAmount,
      due_amount: totalAmount,
    }));
  }, [formState.sub_total, formState.tax, formState.discount, formState.added_cost]);

  const calculateSubTotal = (selectedProducts: (Child & { quantity: number })[]) => {
    if(id && formState.sub_total)
      return formState.sub_total
    return selectedProducts.reduce((acc, curr) => {
      return Number(acc) + Number(curr.sale_price) * curr.quantity;
    }, 0);
  };

  const calculateTax = (subTotal: number, addedCost: number, hasTax: boolean) => {
    if (hasTax) {
      return ((13 / 100) * (subTotal + Number(addedCost))).toFixed(2);
    }
    return 0;
  };

  const calculateTotalAmount = (subTotal: number, addedCost: number, tax: number, discount: number) => {
    let total = Number(subTotal) + Number(addedCost) + Number(tax);
    if (discount) {
      total -= (discount / 100) * total;
    }
    return total;
  };
  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await orderApis.getOrderByID(id);
      if (response.data.status) {
        const order = response.data.data.order;
        const products = response.data.data.products;
        const customer = response.data.data.customer;
        if (order.tax) {
          setHasTax(true)
        }
        // Pre-fill form state with fetched order details
        setFormState({
          customer: customer._id,
          ship_method: order.ship_method,
          ship_address: {
            street: order.ship_address?.street || '',
            city: order.ship_address?.city || '',
            pin: order.ship_address?.pin || ''
          },
          comment: order.comment,
          added_cost: order.added_cost,
          discount: order.discount,
          tax: order.tax,
          amount_total: order.amount_total,
          due_amount: order.due_amount,
          paid_amount: order.paid_amount,
          status: order.status,
          sub_total: order.sub_total ?? null,
        });
        setCustomerName(`${customer.firstname} ${customer.lastname}`);
        
        // Pre-fill selected products with fetched products
        const preFilledProducts = products.map((prod: any) => {
          // console.log(prod)
          return {
            ...prod[0],
            quantity: prod.quantity,
            parentName: prod.parent_name,
            parent_id: prod.product_id
          }
        });
        setSelectedProducts(preFilledProducts);
      }
    } catch (error: any) {
      toast.error(error.response.data.err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (SKU: string, quantity: number) => {
    setSelectedProducts(selectedProducts.map(product =>
      product.SKU === SKU ? { ...product, quantity } : product
    ));
  };
  const handleProductChange = (product: Child & { parentName: string }) => {
    if (!selectedProducts.some(p => p.SKU === product.SKU)) {
      // console.log(product)
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
      setInputValue('');
    }
  };
  const handleRemoveProduct = (SKU: string) => {
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
          [addressField]: value
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
      toast.info("Please add products first.");
      return;
    } else if (!formState.customer) {
      toast.info("Please select a customer.");
      return;
    } else if (formState.ship_method !== "Store Pickup") {
      if (!formState.ship_address.city || !formState.ship_address.pin || !formState.ship_address.street) {
        toast.info("Please provide complete shipping address.");
        return;
      }
    }

    setLoading(true);
    try {
      const { ship_address, ...formdata } = formState;
      let data = {
        ...formdata,
        ...(formState.ship_method !== "Store Pickup" ? {ship_address} : {}),
        products: selectedProducts.map(item => {
          console.log(item)
          return {
            SKU: item.SKU,
            quantity: item.quantity,
            product_id: item.parent_id
          }
        })
      };
      let res;
      if (id) {
        res = await orderApis.updateOrder(id, data);
      } else {
        res = await orderApis.createOrder(data);
      }

      if (res.data.status) {
        toast.success(`Order successfully ${id ? 'updated' : 'created'}.`);
        navigate(`/orders/${res.data.data._id}/payment`);
      }
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    loading ? <Loading /> : (
      <form className="max-w-2xl mx-auto bg-white p-8 shadow-md rounded-lg">
        <div className="flex mb-8 justify-between items-center">
          <Button className='' color={'gray'} onClick={() => navigate("/orders")}>
            <span className='flex gap-2 items-center'><FaChevronLeft />Back</span>
          </Button>
          <h2 className="text-2xl font-semibold">{id ? 'Edit Order' : 'Create Order'}</h2>
          <p></p>
        </div>


        <div className="mb-4">
          <label htmlFor="customer" className="block text-sm font-medium text-gray-700 mb-2">Customer:</label>
          <AutoCompleteCustomerInput
            value={customerName}
            onChange={handleCustomerChange}
          />
        </div>

        <label htmlFor="productsInput" className="block text-sm font-medium text-gray-700 mb-2">Add Products:</label>
        {id ? <></> : <AutocompleteProductInput value={inputValue} onChange={handleProductChange} setInputValue={setInputValue} />}

        <label htmlFor="productsListing" className="block text-sm font-medium text-gray-700 my-2"></label>
        <div className="my-4">
          {selectedProducts.length > 0 && (
            <div className="overflow-x-auto">
              <Table className="min-w-full bg-white border border-gray-200">
                <Table.Head>
                  <Table.HeadCell>Product Name</Table.HeadCell>
                  <Table.HeadCell>SKU</Table.HeadCell>
                  <Table.HeadCell>Price</Table.HeadCell>
                  <Table.HeadCell>Quantity</Table.HeadCell>
                  <Table.HeadCell>Total</Table.HeadCell>
                  <Table.HeadCell>Action</Table.HeadCell>
                </Table.Head>
                <Table.Body>
                  {selectedProducts.map(product => (
                    <Table.Row key={product.SKU} className="border-b border-gray-200">
                      <Table.Cell>{product.parentName}</Table.Cell>
                      <Table.Cell>{product.SKU}</Table.Cell>
                      <Table.Cell>{product.sale_price}</Table.Cell>
                      <Table.Cell>
                        <TextInput
                          type="number"
                          disabled={id !== undefined}
                          value={product.quantity}
                          onChange={e => handleQuantityChange(product.SKU, Number(e.target.value))}
                          min={1}
                          className=""
                        />
                      </Table.Cell>
                      <Table.Cell>{(product.sale_price * product.quantity).toFixed(2)}</Table.Cell>
                      <Table.Cell>
                        <button
                          type="button"
                          onClick={() => handleRemoveProduct(product.SKU)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <MdDelete />
                        </button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                  <Table.Row key={"sub_total"}>
                    <Table.Cell>Total</Table.Cell>
                    <Table.Cell />
                    <Table.Cell>{formState.sub_total}</Table.Cell>
                    <Table.Cell />
                  </Table.Row>
                </Table.Body>
              </Table>
            </div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">Comment:</label>
          <textarea
            id="comment"
            name="comment"
            value={formState.comment}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={4}
          ></textarea>
        </div>

        <div className="mb-4">
          <label htmlFor="ship_method" className="block text-sm font-medium text-gray-700 mb-2">Shipping Method:</label>
          <select
            id="ship_method"
            name="ship_method"
            value={formState.ship_method}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="MTD Shipping">MTD Shipping</option>
            <option value="Store Pickup">Store Pickup</option>
          </select>
        </div>

        {formState.ship_method !== "Store Pickup" && (
          <>
            <div className="mb-4">
              <label htmlFor="ship_address.street" className="block text-sm font-medium text-gray-700 mb-2">Street:</label>
              <TextInput
                type="text"
                id="ship_address.street"
                name="ship_address.street"
                value={formState.ship_address.street}
                onChange={handleInputChange}
                className=""
              />
            </div>
            <div className="mb-4">
              <label htmlFor="ship_address.city" className="block text-sm font-medium text-gray-700 mb-2">City:</label>
              <TextInput
                type="text"
                id="ship_address.city"
                name="ship_address.city"
                value={formState.ship_address.city}
                onChange={handleInputChange}
                className=""
              />
            </div>
            <div className="mb-4">
              <label htmlFor="ship_address.pin" className="block text-sm font-medium text-gray-700 mb-2">PIN Code:</label>
              <TextInput
                type="text"
                id="ship_address.pin"
                name="ship_address.pin"
                value={formState.ship_address.pin}
                onChange={handleInputChange}
                className=""
              />
            </div>
          </>
        )}

        <div className="mb-4 flex items-center">
          <label htmlFor="hasTax" className="block text-sm font-medium text-gray-700 mr-2">Add Tax:</label>
          <ToggleSwitch
            id="hasTax"
            checked={hasTax}
            onChange={(checked) => setHasTax(checked)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="paid_amount" className="block text-sm font-medium text-gray-700 mb-2">Tax Amount:</label>
          <TextInput
            disabled
            type="number"
            // id="paid_amount"
            // name="paid_amount"
            value={formState.tax}
          // onChange={rder-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="added_cost" className="block text-sm font-medium text-gray-700 mb-2">Additional Cost:</label>
          <TextInput
            disabled={id !== undefined}
            type="number"
            id="added_cost"
            name="added_cost"
            value={formState.added_cost}
            onChange={handleInputChange}
            min={0}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-2">Discount (%):</label>
          <TextInput
            type="number"
            id="discount"
            name="discount"
            value={formState.discount}
            onChange={handleInputChange}
            className=""
            min={0}
            max={100}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="paid_amount" className="block text-sm font-medium text-gray-700 mb-2">Paid Amount:</label>
          <TextInput
            disabled
            type="number"
            id="paid_amount"
            name="paid_amount"
            value={formState.paid_amount}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="amount_total" className="block text-sm font-medium text-gray-700 mb-2">Total Amount:</label>
          <TextInput
            disabled
            type="number"
            id="amount_total"
            name="amount_total"
            value={formState.amount_total}
            readOnly
            className=""
          />
        </div>



        {id !== undefined ? <div className="mb-4">
          <label htmlFor="due_amount" className="block text-sm font-medium text-gray-700 mb-2">Due Amount:</label>
          <TextInput
            type="number"
            id="due_amount"
            name="due_amount"
            value={(formState.amount_total - formState.paid_amount).toFixed(2)}
            readOnly
            className=""
          />
        </div> : <></>}
        {id?<div className="mb-4">
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
            </div>:<></>}

        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
        >
          {id ? 'Update Order' : 'Create Order'}
        </button>
      </form>
    )
  );
};

export default OrderForm;
