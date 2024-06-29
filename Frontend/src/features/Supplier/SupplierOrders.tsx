import React, { useEffect, useState } from 'react';
import { supplierApis } from '../../config/supplierApi';
import { toast } from 'react-toastify';
import Loading from '../../util/Loading';
import { Table } from 'flowbite-react';
import { MdArrowDropDown, MdArrowDropUp } from 'react-icons/md';
import { Supplier } from '../../config/models/supplier';

interface Child {
    SKU: string;
    name: string;
    color: string;
    selling_price: number;
    sale_price: number;
    cost_price: number;
    status: string;
    _id: string;
}

interface Product {
    _id: string;
    name: string;
    category: string;
    ID: string;
    children: Child[];
    supplier: Supplier;
    createdAt: string;
    updatedAt: string;
    __v: number;
    quantity: number;
}

interface Order {
    _id: string;
    customer: string;
    products: Product[];
    ship_method: string;
    comment: string;
    added_cost: number;
    discount: number;
    tax: number;
    amount_total: number;
    due_amount: number;
    paid_amount: number;
    sub_total: number;
    status: string;
    payments: any[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface SupplierOrder {
    supplier: Supplier;
    order: Order;
    poID: string;
    createdAt: string;
    updatedAt: string;
}

const SupplierOrdersTable = () => {
    const [supplierOrders, setSupplierOrders] = useState<SupplierOrder[]>([]);
    const [loading, setLoading] = useState<boolean>(false)
    const [filteredOrders, setFilteredOrders] = useState<SupplierOrder[]>([])
    const [searchTerm, setSearchTerm] = useState('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    useEffect(() => {
        fetchSupplierOrders();
    }, []);

    useEffect(() => {
        sortAndFilter();
    }, [searchTerm])

    const sortAndFilter = () => {
        let filter = supplierOrders.filter(order =>
            order.supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.poID.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.supplier.phoneNumber1?.toString()?.includes(searchTerm) ||
            order.supplier.phoneNumber2?.toString()?.includes(searchTerm)
        );
        const sortedData = filter.sort((a, b) => {
            if (sortDirection === 'asc') {
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            } else {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
        });

        setFilteredOrders(sortedData)
    }

    const fetchSupplierOrders = async () => {
        try {
            setLoading(true);
            const response = await supplierApis.getAllSupplierOrders();
            if (response.data.status) {
                // console.log(response.data.data)
                setSupplierOrders(response.data.data);
                setFilteredOrders(response.data.data);

            } else {
                toast.error(response.data.err)
            }
        } catch (error: any) {
            toast.error(error.response.data.err);
        } finally {
            setLoading(false);
        }
    };



    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSort = () => {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    };

    console.log(filteredOrders)
    return (
        loading ? <Loading /> : <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Order List</h1>
            <div className="container mx-auto p-4">
                <div className="flex justify-between mb-4">
                    <input
                        type="text"
                        placeholder="Search by Supplier Name or PO ID"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="min-w-32 p-2 border rounded shadow "
                    />

                </div>
                <div className="overflow-x-auto">
                    <Table className="min-w-full bg-white border">
                        <Table.Head>
                            <Table.HeadCell onClick={handleSort} className="py-2 px-4 border-b cursor-pointer">Date {sortDirection === "asc" ? <MdArrowDropDown className='inline text-xl' /> : <MdArrowDropUp className='inline text-xl' />}</Table.HeadCell>
                            <Table.HeadCell className="py-2 px-4 border-b">Supplier Name</Table.HeadCell>
                            <Table.HeadCell className="py-2 px-4 border-b">Supplier Address</Table.HeadCell>
                            <Table.HeadCell className="py-2 px-4 border-b">Email ID</Table.HeadCell>
                            <Table.HeadCell className="py-2 px-4 border-b">Phone Number</Table.HeadCell>
                            <Table.HeadCell className="py-2 px-4 border-b">Purchase ID</Table.HeadCell>
                            <Table.HeadCell className="py-2 px-4 border-b">Order Items</Table.HeadCell>
                        </Table.Head>
                        <Table.Body>
                            {filteredOrders.map((supplierOrder, index) => {
                                let lastProductName = '';
                                return <Table.Row key={index} className="hover:bg-gray-100">
                                    <Table.Cell className="py-2 px-4 border-b">{new Date(supplierOrder.createdAt).toLocaleDateString()}</Table.Cell>
                                    <Table.Cell className="py-2 px-4 border-b">{supplierOrder.supplier?.name}</Table.Cell>
                                    <Table.Cell className="py-2 px-4 border-b">{supplierOrder.supplier?.pickupLocation.address}</Table.Cell>
                                    <Table.Cell className="py-2 px-4 border-b">{supplierOrder.supplier?.emailID}</Table.Cell>
                                    <Table.Cell className="py-2 px-4 border-b">
                                        {supplierOrder.supplier?.phoneNumber1}
                                        {supplierOrder.supplier?.phoneNumber2 && <br />}
                                        {supplierOrder.supplier?.phoneNumber2}
                                    </Table.Cell>
                                    <Table.Cell className="py-2 px-4 border-b">{supplierOrder.poID}</Table.Cell>
                                    <Table.Cell className="py-2 px-4 border-b">
                                        <ul>
                                            {supplierOrder.order.products.filter((product: Product) => product.supplier?.supplier_id === supplierOrder.supplier?._id).map((product: Product, pIndex: number) => {
                                                let flag = lastProductName !== product.name
                                                lastProductName = product.name
                                                return <li key={pIndex}>
                                                    {flag ? <strong className='text-nowrap'>{product.name}</strong> : <></>}
                                                    <ul className="ml-4">
                                                        {product.children.map((child, cIndex) => (
                                                            <li key={cIndex} className='text-nowrap'>
                                                                {product.quantity} x {child.name}<br />
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </li>
                                            })}
                                        </ul>
                                    </Table.Cell>
                                </Table.Row>
                            })}
                        </Table.Body>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default SupplierOrdersTable;
