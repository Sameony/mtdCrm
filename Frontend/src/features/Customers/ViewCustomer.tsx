import { useEffect, useState, useRef } from 'react';
import { customerApis } from '../../config/customerApi';
import { toast } from 'react-toastify';
import { Table } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { RiAddBoxFill } from 'react-icons/ri';
import Loading from '../../util/Loading';
import { Customer } from '../../config/models/customer';

const CustomerList = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const hasFetchedCustomers = useRef(false);
  const navigate = useNavigate()

  useEffect(() => {
    // console.log('useEffect for searchQuery and customers triggered', loading);
    let temp = customers.filter(
      customer =>
        customer.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCustomers(temp);
  }, [searchQuery, customers]);

  useEffect(() => {
    // console.log('useEffect for searchQuery and customers triggered');
    if (!hasFetchedCustomers.current) {
      fetchCustomers();
    }
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await customerApis.getCustomers();
      if (response.data.status) {
        setCustomers(response.data.data);
        setFilteredCustomers(response.data.data);
        // toast.info("Users fetched successfully");
        hasFetchedCustomers.current = true;
      } else {
        toast.error(response.data.err)
      }
    } catch (error: any) {
      toast.error(error.response.data.err);
    } finally {
      setLoading(false);
    }
  };

  return (
    loading?<Loading />:<div className="container mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Customer List</h2>
        <button className=" bg-green-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring focus:ring-indigo-200"
          onClick={() => navigate("/customers/add")}>
          <span className='flex gap-2 items-center'><RiAddBoxFill />Add Customer</span>
        </button>
      </div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
        />
      </div>
      <div className='overflow-x-auto'>
        <Table striped hoverable>
          <Table.Head>
            <Table.HeadCell>First Name</Table.HeadCell>
            <Table.HeadCell>Last Name</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Phone</Table.HeadCell>
            <Table.HeadCell>Address</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {filteredCustomers.map((customer) => (
              <Table.Row key={customer._id}>
                <Table.Cell>{customer.firstname}</Table.Cell>
                <Table.Cell>{customer.lastname}</Table.Cell>
                <Table.Cell>{customer.email}</Table.Cell>
                <Table.Cell>{customer.phone}</Table.Cell>
                <Table.Cell>{customer.address ? customer.address.address : ""}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>

      </div>
    </div>
  );
};

export default CustomerList;
