import { useState } from "react";
import { orderApis } from "../config/orderApi";
import { toast } from "react-toastify";
import { Button, FileInput, Label } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa6";
import { supplierApis } from "../config/supplierApi";

const BulkUpload = (props: any) => {
    const MAX_FILE_SIZE = 5 * 1024 * 1024

    const [file, setFile] = useState<File | null>(null);
    const navigate = useNavigate();

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file && file.size > MAX_FILE_SIZE)
            toast.error("File size exceeds 5MB.")
        else if (file) {
            saveExcelFile(file);
        }
    };

    const saveExcelFile = (file: File) => {
        setFile(file)
    };
    const onFileSubmit = async () => {
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            props.setLoading(true)
            try {
                const response = props.isSupplier ? await supplierApis.createBulkSuppliers(formData) : await orderApis.createBulkProduct(formData);
                if (response.data.status) {
                    toast.success("File data uploaded successfully.")
                    props.isSupplier?navigate("/supplier"):navigate("/products")
                }
                else{
                    toast.error(response.data.err ?? "Something went wrong while uploading file.")
                    console.log("error at api")
                }
            } catch (error) {
                console.error('Error uploading file:', error);
                toast.error('Error uploading file');
            } finally {
                props.setLoading(false)
            }
        }
    };
    const generateSampleCSV = () => {
        const rows_products = [
            ['Parent Name', 'Parent Category', 'Parent ID', 'Parent Supplier Name', 'Child SKU', 'Child Name', 'Child Color', 'Child Selling Price', 'Child Sale Price', 'Child Cost Price', 'Child Product Size L', 'Child Product Size W', 'Child Product Size H', 'Child Shipping Size L', 'Child Shipping Size W', 'Child Shipping Size H', 'Child Weight', 'Child Status'],
            ['Product 1', 'Category1', 'ID001', 'MEGA IMPORTS BRAMPTON', 'SKU001-A', 'Child 1 of P1', 'Red', '100', '80', '60', '10', '5', '2', '12', '6', '3', '1.5', 'in stock'],
            ['Product 1', 'Category1', 'ID001', 'MEGA IMPORTS BRAMPTON', 'SKU001-B', 'Child 2 of P1', 'Blue', '150', '120', '90', '15', '7', '3', '17', '8', '4', '2.0', 'out of stock'],
            ['Product 2', 'Category2', 'ID002', 'MEGA IMPORTS BRAMPTON', 'SKU002-A', 'Child 1 of P2', 'Green', '200', '160', '130', '20', '10', '5', '22', '12', '6', '3.0', 'discontinued'],
        ];
        const rows_Supplier = [
            ['name', 'phoneNumber1', 'phoneNumber2', 'emailID', 'pickupLocation', 'pickupGoogleMapLink'],
            ['Supplier 1', '1234567890', '', 'supplier1@example.com', 'Location 1', 'https://maps.google.com/?q=Location+1'],
            ['Supplier 2', '0987654321', '1231231234', 'supplier2@example.com', 'Location 2', 'https://maps.google.com/?q=Location+2'],
            ['Supplier 3', '5555555555', '6666666666', 'supplier3@example.com', 'Location 3', 'https://maps.google.com/?q=Location+3'],
        ];

        const rows = props.isSupplier ? rows_Supplier : rows_products
        let csvContent = "";

        rows.forEach((rowArray) => {
            let row = rowArray.join(",");
            csvContent += row + "\r\n";
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'sample.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="p-8 mx-auto">
            <div className="flex items-center justify-between  mb-8">
                <Button className='' color={'gray'} onClick={() => props.setBulkUpload(false)}>
                    <span className='flex gap-2 items-center'><FaChevronLeft />Back</span>
                </Button>
                <h1 className="text-xl text-center text-gray-500">{`${props.isSupplier ? "Add multiple Suppliers" : "Upload multiple products"}`}</h1>
                <p></p>
            </div>
            <Label
                htmlFor="dropzone-file"
                className="flex h-64 mt-8 w-full object-contain cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                onDragOver={(e) => {
                    e.preventDefault();
                    // Add styles to indicate hovering over drop zone
                    e.currentTarget.classList.add('border-blue-500'); // Example class for highlighting
                }}
                onDragLeave={(e) => {
                    // Remove styles when leaving drop zone
                    e.currentTarget.classList.remove('border-blue-500');
                }}
                onDrop={(e) => {
                    e.preventDefault();
                    const files = Array.from(e.dataTransfer.files);
                    saveExcelFile(files[0]); // Implement this function to handle dropped files
                    // Remove styles after dropping
                    e.currentTarget.classList.remove('border-blue-500');
                }}
            >
                <div className="flex flex-col items-center justify-center pb-6 pt-5">
                    <svg
                        className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Excel files only (MAX. 5MB)</p>
                </div>
                <FileInput accept='.csv, .xlsx, .xls' id="dropzone-file" className="hidden" onChange={handleFileInputChange} />
            </Label>
            {file ? <p className="text-sm my-4 text-gray-500">File Selected: {file?.name}</p> : <></>}
            <div className="flex items-center justify-center gap-5 mt-5">
                <button onClick={generateSampleCSV} className=" bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-200 flex items-center">
                    Get Sample File
                </button>
                <button onClick={onFileSubmit} className=" bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-200 flex items-center">
                    {`${props.isSupplier ? "Create Suppliers" : "Add products"}`}
                </button>
            </div>
        </div>
    )
}

export default BulkUpload