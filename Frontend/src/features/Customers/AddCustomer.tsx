import React, { useState } from 'react';
import { customerApis } from '../../config/customerApi';
import { toast } from 'react-toastify';
import Loading from '../../util/Loading';
import { useNavigate } from 'react-router-dom';
import { Button } from 'flowbite-react';
import { FaChevronLeft } from 'react-icons/fa6';
import AutoCompleteAddress from '../../util/AutoCompleteGoogle';
import { CustomerForm } from '../../config/models/customerForm';
import { Address } from '../../config/models/address';

const AddCustomer: React.FC = () => {
  const [formState, setFormState] = useState<CustomerForm>({
    email: '',
    firstname: '',
    lastname: '',
    phone: 0,
    // address:{
    //   address:"",
    //   longitude:"",
    //   latitude:""
    // }
  });
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  console.log(formState)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes('address.')) {
      // const addressField = name.split('.')[1];
      // setFormState({
      //   ...formState,
      //   address: {
      //     ...formState.address,
      //     [addressField]: value
      //   }
      // });
    } else {
      setFormState({
        ...formState,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)
    try {
      let res = await customerApis.addCustomer(formState)
      // console.log(res)
      if (res.data.status) {
        toast.success("New customer added successfully")
        navigate("/customers")
      }
      else {
        toast.error(res.data.err)
      }
    } catch (error: any) {
      toast.error(error.response.data.err)
      // console.log(error.response.data.err)
    } finally {
      setLoading(false)
    }
    // Perform form submission logic, such as making an API call to create a new customer
    // console.log(formState);
  };

  const handleAddressChange = (address: Address) => {
    if (address.address) {
      setFormState({ ...formState, address: address })
    }
  };

  return (
    loading ? <Loading /> : <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-8 shadow-md rounded-lg">
      <div className="flex items-center mb-12 justify-between">
        <Button className='' color={'gray'} onClick={() => navigate(-1)}>
          <span className='flex gap-2 items-center'><FaChevronLeft />Back</span>
        </Button>
        <h2 className="text-2xl font-semibold">Add Customer</h2>
        <p></p>
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">* Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formState.email}
          onChange={handleInputChange}
          required
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-2">* First Name:</label>
        <input
          type="text"
          id="firstname"
          name="firstname"
          value={formState.firstname}
          onChange={handleInputChange}
          required
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-2">* Last Name:</label>
        <input
          type="text"
          id="lastname"
          name="lastname"
          value={formState.lastname}
          onChange={handleInputChange}
          required
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">* Phone:</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formState.phone === 0 ? "" : formState.phone}
          onChange={handleInputChange}
          required
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">Address:</label>
        <AutoCompleteAddress onChange={handleAddressChange} />
      </div>


      {/* <div className="mb-4">
        <label htmlFor="address.street" className="block text-sm font-medium text-gray-700 mb-2">Street:</label>
        <input
          type="text"
          id="address.street"
          name="address.street"
          value={formState.address ? formState.address.street : ""}
          onChange={handleInputChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="address.city" className="block text-sm font-medium text-gray-700 mb-2">City:</label>
        <input
          type="text"
          id="address.city"
          name="address.city"
          value={formState.address ? formState.address.city : ""}
          onChange={handleInputChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="address.pin" className="block text-sm font-medium text-gray-700 mb-2">Pin:</label>
        <input
          type="text"
          id="address.pin"
          name="address.pin"
          value={formState.address ? formState.address.pin : ""}
          onChange={handleInputChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
        />
      </div> */}

      <button type="submit" className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
        Create Customer
      </button>
    </form>
  );
};

export default AddCustomer;
