import React, { useState, useEffect, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { Supplier } from '../../config/models/supplier';
import { supplierApis } from '../../config/supplierApi';
import { Table } from 'flowbite-react';

const ViewSuppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await supplierApis.getAllSuppliers();
        if (!response.data.status) {
          throw new Error('Failed to fetch suppliers');
        }
        setSuppliers(response.data.data);
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to fetch suppliers');
      }
    };

    fetchSuppliers();
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.phoneNumber1.includes(searchTerm)
  );

  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Suppliers</h2>
      <input
        type="text"
        placeholder="Search by name or mobile number"
        value={searchTerm}
        onChange={handleSearchChange}
        className="mb-4 p-2 border border-gray-300 rounded-md md:min-w-72"
      />
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
                <Table.Cell className="py-2 px-4 border-b">{supplier.pickupLocation}</Table.Cell>
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
