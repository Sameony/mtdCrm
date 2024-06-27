import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Supplier } from '../../config/models/supplier';
import { supplierApis } from '../../config/supplierApi';
import { toast } from 'react-toastify';
import BulkUpload from '../../util/BulkUpload';
import Loading from '../../util/Loading';
import { Button } from 'flowbite-react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';

interface SupplierErrors {
  name?: string;
  phoneNumber1?: string;
  phoneNumber2?: string;
  emailID?: string;
  pickupLocation?: string;
  pickupGoogleMapLink?: string;
}

const SupplierForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<Supplier>({
    name: '',
    phoneNumber1: '',
    phoneNumber2: '',
    emailID: '',
    pickupLocation: '',
    pickupGoogleMapLink: '',
  });
  const [errors, setErrors] = useState<SupplierErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [bulkUpload, setBulkUpload] = useState<boolean>(false);


  useEffect(() => {
    const fetchSupplier = async () => {
      if (id) {
        try {
          const response = await supplierApis.getSupplierById(id);
          if (!response.data.status) {
            toast.error(response.data.err ?? 'Failed to fetch supplier');
          }
          setFormData(response.data.data);
        } catch (error) {
          console.error('Error:', error);
          toast.error('Failed to fetch supplier details');
        }
      }
    };

    fetchSupplier();
  }, [id]);

  const validate = (): boolean => {
    const newErrors: SupplierErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.phoneNumber1) newErrors.phoneNumber1 = 'Primary phone number is required';
    if (!/^\d+$/.test(formData.phoneNumber1)) newErrors.phoneNumber1 = 'Primary phone number must be numeric';
    if (formData.phoneNumber2 && !/^\d+$/.test(formData.phoneNumber2)) newErrors.phoneNumber2 = 'Secondary phone number must be numeric';
    if (!formData.emailID) newErrors.emailID = 'Email ID is required';
    if (!/\S+@\S+\.\S+/.test(formData.emailID)) newErrors.emailID = 'Email ID is invalid';
    if (!formData.pickupLocation) newErrors.pickupLocation = 'Pickup location is required';
    if (!formData.pickupGoogleMapLink) newErrors.pickupGoogleMapLink = 'Pickup Google Map link is required';
    if (!/^https?:\/\/.+/.test(formData.pickupGoogleMapLink)) newErrors.pickupGoogleMapLink = 'Pickup Google Map link is invalid';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    let { name, value } = e.target;
    if (name === "name")
      value = value?.toLocaleUpperCase()
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = id ? await supplierApis.updateSupplier(id, formData) : await supplierApis.createSupplier(formData)
      if (response.data.status) {
        toast.success("Successfully" + id ? " updated" : " added" + "the supplier.")
        navigate('/supplier');
      } else {
        toast.error("Something went wrong")
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.response.data.err ?? 'Failed to save supplier');
    }
  };

  return (
    loading ? <Loading /> : bulkUpload ? <BulkUpload setLoading={setLoading} setBulkUpload={setBulkUpload} isSupplier={true} /> : <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className='mb-6 flex items-center justify-between'>
        <Button color='gray' onClick={() => navigate(-1)}>
          <span className='flex gap-2 items-center'><FaChevronLeft />Back</span>
        </Button>
        <h2 className="text-2xl font-semibold mb-4">{id ? 'Edit Supplier' : 'Add Supplier'}</h2>
        {id ? <p></p> : <Button color='gray' onClick={() => setBulkUpload(true)}>
          <span className='flex gap-2 items-center'>Upload Multiple<FaChevronRight /></span>
        </Button>}
      </div>
      <form onSubmit={handleSubmit}>
        {[
          { label: 'Name', name: 'name', type: 'text' },
          { label: 'Primary Phone Number', name: 'phoneNumber1', type: 'text' },
          { label: 'Secondary Phone Number', name: 'phoneNumber2', type: 'text' },
          { label: 'Email ID', name: 'emailID', type: 'email' },
          { label: 'Pickup Location', name: 'pickupLocation', type: 'text' },
          { label: 'Pickup Google Map Link', name: 'pickupGoogleMapLink', type: 'text' },
        ].map((field) => (
          <div key={field.name} className="mb-4">
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}:
            </label>
            <input

              type={field.type}
              id={field.name}
              name={field.name}
              value={formData[field.name as keyof Supplier]} // Type assertion to satisfy TypeScript
              onChange={handleInputChange}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${errors[field.name as keyof SupplierErrors] ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors[field.name as keyof SupplierErrors] && (
              <p className="text-red-500 text-sm">{errors[field.name as keyof SupplierErrors]}</p>
            )}
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200"
        >
          {id ? 'Update Supplier' : 'Add Supplier'}
        </button>
      </form>
    </div>
  );
};

export default SupplierForm;
