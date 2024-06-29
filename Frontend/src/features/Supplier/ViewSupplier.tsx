import React, { useState, useEffect, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { Supplier } from '../../config/models/supplier';
import { supplierApis } from '../../config/supplierApi';
import { Table } from 'flowbite-react';
import Loading from '../../util/Loading';

const ViewSuppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState("Supplier")
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoading(true)
      try {
        const response = await supplierApis.getAllSuppliers();
        if (!response.data.status) {
          throw new Error('Failed to fetch suppliers');
        }
        setSuppliers(response.data.data);
        setFilteredSuppliers(response.data.data)
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to fetch suppliers');
      } finally {
        setLoading(false)
      }
    };

    fetchSuppliers();
  }, []);

  const filterApply = (text: string, category: string) => {
    let temp = suppliers.filter((supplier) => supplier.category === category && (supplier.name.toLowerCase().includes(text.toLowerCase()) ||
      supplier.phoneNumber1.includes(text))
    );
    setFilteredSuppliers(temp)
  }

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    filterApply(e.target.value, category)
  };

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value)
    filterApply(searchTerm, e.target.value)
  }



  return (
    loading ? <Loading /> : <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Suppliers</h2>
      <div className="mb-4 flex gap-4 items-center justify-between">
        <input
          type="text"
          placeholder="Search by name or mobile number"
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-2 border border-gray-300 rounded-md md:min-w-72"
        />
        {/* <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="category">Category: </label> */}
        <select className='w-64 rounded-md text-gray-500 accent-gray-500' value={category} onChange={handleStatusChange}>
          <option value="Supplier">Supplier</option>
          <option value="Location">Location</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <Table className="min-w-full bg-white border">
          <Table.Head>

            <Table.HeadCell className="py-2 px-4 border-b">Name</Table.HeadCell>
            <Table.HeadCell className="py-2 px-4 border-b">Primary Phone</Table.HeadCell>
            <Table.HeadCell className="py-2 px-4 border-b">Secondary Phone</Table.HeadCell>
            <Table.HeadCell className="py-2 px-4 border-b">Email ID</Table.HeadCell>
            <Table.HeadCell className="py-2 px-4 border-b">Pickup Location</Table.HeadCell>
            <Table.HeadCell className="py-2 px-4 border-b">Actions</Table.HeadCell>

          </Table.Head>
          <Table.Body>
            {filteredSuppliers.map((supplier) => (
              <Table.Row key={supplier._id}>
                <Table.Cell className="py-2 px-4 border-b">{supplier.name}</Table.Cell>
                <Table.Cell className="py-2 px-4 border-b">{supplier.phoneNumber1}</Table.Cell>
                <Table.Cell className="py-2 px-4 border-b">{supplier.phoneNumber2}</Table.Cell>
                <Table.Cell className="py-2 px-4 border-b">{supplier.emailID}</Table.Cell>
                <Table.Cell className="py-2 px-4 border-b">{supplier.pickupLocation.address}</Table.Cell>
                <Table.Cell className="py-2 px-4 border-b">
                  <Link to={`/supplier/${supplier._id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                    Edit
                  </Link>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};

export default ViewSuppliers;
