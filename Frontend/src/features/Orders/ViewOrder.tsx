import { Table } from 'flowbite-react';
import React, { useState, useEffect } from 'react';
import { orderApis } from '../../config/orderApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Loading from '../../util/Loading';


const ViewOrder: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([])
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderApis.getAllOrders();
      if (response.data.status) {
        setOrders(response.data.data);
        setFilteredOrders(response.data.data);
        // toast.info("Users fetched successfully");

      } else {
        toast.error(response.data.err)
      }
    } catch (error: any) {
      toast.error(error.response.data.err);
    } finally {
      setLoading(false);
    }
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    let filtered = orders.filter((order) =>
      order.customer.email.toLowerCase().includes(search.toLowerCase())
    )
    setFilteredOrders(filtered)
  };

  const handleEditOrder = (id: string) => {
    navigate(`/orders/${id}/edit`)
    // console.log(`Edit order with id: ${id}`);
  };

  return (
    loading?<Loading />:<div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Order List</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by customer email"
          value={search}
          onChange={handleSearchChange}
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 w-full"
        />
      </div>
      <div className="overflow-x-auto">
        <Table striped>
          <Table.Head>
            <Table.HeadCell className="px-4 py-2 border-b border-gray-200">Customer Email</Table.HeadCell>
            <Table.HeadCell className="px-4 py-2 border-b border-gray-200">Order ID</Table.HeadCell>
            <Table.HeadCell className="px-4 py-2 border-b border-gray-200">Total Amount</Table.HeadCell>
            <Table.HeadCell className="px-4 py-2 border-b border-gray-200">Due Amount</Table.HeadCell>
            <Table.HeadCell className="px-4 py-2 border-b border-gray-200">Ship Method</Table.HeadCell>
            <Table.HeadCell className="px-4 py-2 border-b border-gray-200">Status</Table.HeadCell>
            <Table.HeadCell className="px-4 py-2 border-b border-gray-200">Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {filteredOrders.map((order) => (
              <Table.Row key={order.order._id} className="hover:bg-gray-100">
                <Table.Cell className="px-4 py-2 border-b border-gray-200">{order.customer.email}</Table.Cell>
                <Table.Cell className="px-4 py-2 border-b border-gray-200">{order.order._id}</Table.Cell>
                <Table.Cell className="px-4 py-2 border-b border-gray-200">{order.order.amount_total}</Table.Cell>
                <Table.Cell className="px-4 py-2 border-b border-gray-200">{order.order.due_amount}</Table.Cell>
                <Table.Cell className="px-4 py-2 border-b border-gray-200">{order.order.ship_method}</Table.Cell>
                <Table.Cell className="px-4 py-2 border-b border-gray-200">{order.order.status}</Table.Cell>
                <Table.Cell className="px-4 py-2 border-b border-gray-200">
                  <button
                    onClick={() => handleEditOrder(order.order._id)}
                    className="px-3 py-1 text-white bg-blue-500 rounded-md hover:bg-blue-700 focus:outline-none"
                  >
                    Edit
                  </button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};

export default ViewOrder;
