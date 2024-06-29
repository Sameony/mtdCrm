import { Table } from 'flowbite-react';
import React, { useState, useEffect } from 'react';
import { orderApis } from '../../config/orderApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Loading from '../../util/Loading';
import { MdEdit, MdRemoveRedEye } from 'react-icons/md';
import { RiAddBoxFill } from 'react-icons/ri';


const ViewOrder: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([])
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false)
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [filterDate, setFilterDate] = useState<{ start: string, end: string }>({ start: "", end: "" })
  const navigate = useNavigate()


  useEffect(() => {
    fetchOrders();
  }, []);

  // console.log(filteredOrders)

  useEffect(() => {
    const filtered = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      const isWithinDateRange = (!filterDate.start || !filterDate.end) ||
        (orderDate >= new Date(filterDate.start) && orderDate <= new Date(filterDate.end));
      const matchesSearch = order.customer?.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !statusFilter || order.status === statusFilter;

      return isWithinDateRange && matchesSearch && matchesStatus;
    });
    setFilteredOrders(filtered);
  }, [filterDate, search, statusFilter, orders]);



  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderApis.getAllOrders();
      if (response.data.status) {
        // console.log(response.data.data)
        setOrders(response.data.data);
        setFilteredOrders(response.data.data);
        // toast.info("Users fetched successfully");
        // console.log(response.data.data)
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
  };

  const handleEditOrder = (id: string) => {
    navigate(`/orders/${id}/edit`)
  };
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };
  const changeFilterDate = (e: string, mode: "start" | 'end') => {

    setFilterDate({ ...filterDate, [mode]: e })
  }
  // console.log(filterDate)
  return (
    loading ? <Loading /> : <div className=" mx-auto bg-white p-8 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Order List</h1>
        <button className=" bg-green-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring focus:ring-indigo-200"
          onClick={() => navigate("/orders/add")}>
          <span className='flex gap-2 items-center'><RiAddBoxFill />Create Order</span>
        </button>

      </div>
      <div className="mb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className='flex items-end gap-4 flex-1'>
          <input
            type="text"
            placeholder="Search by customer email"
            value={search}
            onChange={handleSearchChange}
            className="flex-1 px-3 py-2 border border-gray-300 min-w-32 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 w-full"
          />
          <label>
            Status
            <select className='ml-2 rounded-md text-gray-500 accent-gray-500' value={statusFilter} onChange={handleStatusChange}>
              <option value="">All</option>
              <option value="Processing">Processing</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Refund Initiated">Refund Initiated</option>
              <option value="Refund Completed">Refund Completed</option>
              <option value="Partially Completed">Partially Completed</option>
            </select>
          </label>
        </div>

        <div className='flex justify-between sm:justify-start my-3 sm:my-0 gap-5 text-gray-500'>
          <label>
            Start Date
            <input
              type="date"
              className='ml-2 rounded-md border-gray-500 accent-gray-500 cursor-pointer'
              value={filterDate.start}
              onChange={(e) => changeFilterDate(e.target.value, "start")}
            />
          </label>
          <label>
            End Date
            <input
              type="date"
              className='ml-2 rounded-md border-gray-500 accent-gray-500 cursor-pointer'
              value={filterDate.end}
              onChange={(e) => changeFilterDate(e.target.value, "end")}
            />
          </label>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table striped>
          <Table.Head>
            <Table.HeadCell className="px-4 py-2 border-b border-gray-200">Created on</Table.HeadCell>
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
              <Table.Row key={order._id} className="hover:bg-gray-100">
                <Table.Cell className="px-4 py-2 border-b border-gray-200">{new Date(order.createdAt).toISOString().split('T')[0]}</Table.Cell>
                <Table.Cell className="px-4 py-2 border-b border-gray-200">{order.customer?.email}</Table.Cell>
                <Table.Cell className="px-4 py-2 border-b border-gray-200">{order._id}</Table.Cell>
                <Table.Cell className="px-4 py-2 border-b border-gray-200">{order.amount_total?.toFixed(2)}</Table.Cell>
                <Table.Cell className="px-4 py-2 border-b border-gray-200">{order.due_amount?.toFixed(2)}</Table.Cell>
                <Table.Cell className="px-4 py-2 border-b border-gray-200">{order.ship_method}</Table.Cell>
                <Table.Cell className="px-4 py-2 border-b border-gray-200">{order.status}</Table.Cell>
                <Table.Cell className="px-4 py-2 border-b border-gray-200 ">
                  <MdRemoveRedEye className='inline mr-2 cursor-pointer' title='View Order' />
                  <MdEdit className='inline mx-2 cursor-pointer' title='Edit Order' onClick={() => handleEditOrder(order._id)} />
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
