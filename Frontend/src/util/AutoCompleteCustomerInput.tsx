import React, { useState, useEffect, useRef } from 'react';
import { customerApis } from '../config/customerApi';
import { toast } from 'react-toastify';

interface Customer {
  _id: string;
  firstname: string;
  lastname: string;
  phone: number;
}

const AutoCompleteCustomerInput: React.FC<{ value: string, onChange: (customerId: string, customerName: string) => void }> = ({ value, onChange }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
    //   setLoading(true);
      const response = await customerApis.getCustomers();
      // console.log(response)
      if (response.data.status) {
        setCustomers(response.data.data);
        setFilteredCustomers(response.data.data);
        // toast.info("Users fetched successfully");
      }
    } catch (error: any) {
      console.log(error)
      toast.error(error.response?.data.err.toString()??error.message.toString());
    } finally {
    //   setLoading(false);
    }
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setShowDropdown(true);
    onChange('', query);

    const filtered = customers.filter(customer =>
      customer.firstname.toLowerCase().includes(query) ||
      customer.lastname.toLowerCase().includes(query) ||
      customer.phone.toString().includes(query)
      // customer.
    );
    setFilteredCustomers(filtered);
  };

  const handleCustomerSelect = (customer: Customer) => {
    onChange(customer._id, `${customer.firstname} ${customer.lastname}`);
    setShowDropdown(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => setShowDropdown(true)}
        placeholder="Search by name or phone"
        className=" w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
      />
      {showDropdown && filteredCustomers.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
          {filteredCustomers.map(customer => (
            <li
              key={customer._id}
              onClick={() => handleCustomerSelect(customer)}
              className="px-4 py-2 cursor-pointer hover:bg-indigo-100"
            >
              {customer.firstname} {customer.lastname}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutoCompleteCustomerInput;
