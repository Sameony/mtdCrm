import React, { useState, useEffect, useRef } from 'react';
import { orderApis } from '../config/orderApi';
import { toast } from 'react-toastify';
import { Order } from '../config/models/order';

interface AutocompleteOrderProps {
  onSelect: (order: Order) => void;
  value: Order | null;
}

const AutocompleteOrder: React.FC<AutocompleteOrderProps> = ({ onSelect, value }) => {
  const [query, setQuery] = useState<string>(value ? value._id : '');
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderApis.getAllOrders();
        if (!response.data.status)
          toast.error(response.data.err ?? "Something went wrong while fetching list of orders")
        else {
          const data = response.data.data.filter((order:Order)=>order.status!=="Completed"&&order.ship_method!=="Store Pickup")
          setOrders(data);
          setFilteredOrders(data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsOpen(true);

    const filtered = orders.filter((order) =>
      order.customer.phone.toString().includes(event.target.value)||order._id.includes(event.target.value.toLowerCase())
    );
    setFilteredOrders(filtered);
  };

  const handleSelect = (order: Order) => {
    // setQuery(supplier.name);
    setIsOpen(false);
    onSelect(order);
  };


  return (
    <div className="relative" ref={dropdownRef}>
      <input
        type="text"
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
        value={query}
        onChange={handleInputChange}
        onClick={() => setIsOpen(true)}
        placeholder='Search using phone number or order id'
      />
      {isOpen && filteredOrders.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredOrders.map((order, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(order)}
            >
              {order._id} - {order.customer?.phone}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutocompleteOrder;