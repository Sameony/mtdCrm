import React, { useState, useEffect, useRef } from 'react';
import { supplierApis } from '../config/supplierApi';
import { toast } from 'react-toastify';
import { Supplier } from '../config/models/supplier';

interface AutocompleteSupplierProps {
  onSelect: (supplier: Supplier) => void;
  value: Supplier | undefined;
  isForLocation?:boolean
}

const AutocompleteSupplier: React.FC<AutocompleteSupplierProps> = ({ onSelect, value, isForLocation }) => {
  const [query, setQuery] = useState<string>(value ? value.name : '');
  const [Suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        let mode = 'Supplier'
        if(isForLocation)
          mode = 'Location'
        const response = await supplierApis.getAllSuppliers();
        if (!response.data.status)
          toast.error(response.data.err ?? "Something went wrong while fetching list of suppliers")
        else {
          const data = response.data.data
          console.log(data)
          setSuppliers(data.map((item:Supplier)=>{return {...item, supplier_id:item._id}}).filter((item: any) => item.category === mode))
          setFilteredSuppliers(data.map((item:Supplier)=>{return {...item, supplier_id:item._id}}).filter((item: any) => item.category === mode));
        }
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    };
    fetchSuppliers();
  }, []);
  // console.log(Suppliers)

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

    const filtered = Suppliers.filter((supplier) =>
      supplier.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredSuppliers(filtered);
  };

  const handleSelect = (supplier: Supplier) => {
    setQuery(supplier.name);
    setIsOpen(false);
    onSelect(supplier);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <input
        type="text"
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
        value={query}
        onChange={handleInputChange}
        onClick={() => setIsOpen(true)}
      />
      {isOpen && filteredSuppliers.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredSuppliers.map((supplier,index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(supplier)}
            >
              {supplier.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutocompleteSupplier;
