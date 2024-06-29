import React, { useState } from 'react';
import { Button, Label, TextInput, Table, Datepicker, Popover } from 'flowbite-react';
import AutocompleteSupplier from '../../util/AutoCompleteSupplier';
import { Supplier } from '../../config/models/supplier';
import { Order } from '../../config/models/order';
import { SupplierOrder } from '../../config/models/supplierOrder';
import AutocompleteOrder from '../../util/AutoCompleteOrder';
import AutocompleteSupplierOrder from '../../util/AutoCompleteSupplierOrder';
import Loading from '../../util/Loading';
import { routeApis } from '../../config/routeApi';
import { RouteForm } from '../../config/models/routeForm';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft } from 'react-icons/fa6';
import { IoMdTrash } from 'react-icons/io';
import { MdPhone } from 'react-icons/md';


const CreateRoute = () => {
    const [routeName, setRouteName] = useState('');
    const [routeDate, setRouteDate] = useState<Date>(new Date());
    const [deliveryStops, setDeliveryStops] = useState<Order[]>([]);
    const [pickupStops, setPickupStops] = useState<SupplierOrder[]>([]);
    const [start, setStart] = useState<Supplier>();
    const [end, setEnd] = useState<Supplier>();
    const [loading, setLoading] = useState<boolean>(false)
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        setLoading(true)
        e.preventDefault();
        try {
            let request_obj: RouteForm = { routeDate: routeDate, routeName, deliveryStops: deliveryStops.map(stop => stop._id), pickupStops: pickupStops.map(stop => stop._id), start: start?._id, end: end?._id }
            let response = await routeApis.createRoute(request_obj)
            if (response.data.status) {
                toast.success("Route successfully created")
                navigate("/routes")
            }
            else {
                toast.error("Something went wrong while creating the route.")
            }
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong while creating the route.")
        } finally {
            setLoading(false)
        }

    };

    const addUniqueItem = <T extends { _id: string }>(array: T[], newItem: T): T[] => {
        const index = array.findIndex(item => item._id === newItem._id);
        if (index === -1) {
            return [...array, newItem];
        }
        return array;
    };

    const handleAddDeliveryStop = (order: Order) => {
        setDeliveryStops(prevStops => addUniqueItem(prevStops, order));
    };

    const handleAddPickupStop = (supplierOrder: SupplierOrder) => {
        setPickupStops(prevStops => addUniqueItem(prevStops, supplierOrder));
    };

    const handleRemoveDeliveryStop = (orderId: string) => {
        setDeliveryStops(prevStops => prevStops.filter(stop => stop._id !== orderId));
    };

    const handleRemovePickupStop = (orderId: string) => {
        setPickupStops(prevStops => prevStops.filter(stop => stop._id !== orderId));
    };

    const popupPhoneContent = (number: string | number) => {
        return <div className="w-36 text-center text-sm p-2 text-gray-600 dark:text-gray-400">
            {number}
        </div>
    }

    return (
        loading ? <Loading /> : <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto bg-white p-8 shadow-md rounded-lg">
            <div className="flex mb-8 justify-between items-center">
                <Button className='' color={'gray'} onClick={() => navigate("/routes")}>
                    <span className='flex gap-2 items-center'><FaChevronLeft />Back</span>
                </Button>
                <h2 className="text-2xl font-semibold">{'Create Route'}</h2>
                <p></p>
            </div>

            <div>
                <Label htmlFor="routeName">Route Name</Label>
                <TextInput
                    id="routeName"
                    type="text"
                    value={routeName}
                    onChange={(e) => setRouteName(e.target.value)}
                    required
                />
            </div>

            <div>
                <Label htmlFor="routeDate">Route Date</Label>
                {/* <TextInput
                    
                    type="date"
                    value={routeDate}
                    
                    required
                /> */}
                <Datepicker
                    minDate={new Date()}
                    id="routeDate"
                    value={routeDate.toString()}
                    onSelectedDateChanged={(date) => setRouteDate(date)}
                />
            </div>

            <div>
                <Label htmlFor="deliveryStops">Delivery Stops</Label>
                <AutocompleteOrder onSelect={handleAddDeliveryStop} value={null} />
                <div className="overflow-x-auto">

                    <Table className="mt-2">
                        <Table.Head>
                            <Table.HeadCell>Order ID</Table.HeadCell>
                            <Table.HeadCell>Customer</Table.HeadCell>
                            <Table.HeadCell>Address</Table.HeadCell>
                            <Table.HeadCell>Phone</Table.HeadCell>
                            <Table.HeadCell></Table.HeadCell>
                        </Table.Head>
                        <Table.Body>
                            {deliveryStops.map((stop, index) => (
                                <Table.Row key={index}>
                                    <Table.Cell>{stop._id}</Table.Cell>
                                    <Table.Cell>{stop.customer?.firstname} {stop.customer?.lastname}</Table.Cell>
                                    <Table.Cell className='min-w-36'>{stop.ship_address.address}</Table.Cell>
                                    <Table.Cell>
                                        <Popover content={popupPhoneContent(stop.customer?.phone)} trigger="hover">
                                            <Button size="sm" color={'blue'} className='rounded-full'><MdPhone /></Button>
                                        </Popover></Table.Cell>
                                    <Table.Cell>
                                        <IoMdTrash className='text-2xl text-red-700 cursor-pointer' onClick={() => handleRemoveDeliveryStop(stop._id)} />
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </div>
            </div>

            <div>
                <Label htmlFor="pickupStops">Pickup Stops</Label>
                <AutocompleteSupplierOrder onSelect={handleAddPickupStop} value={null} />
                <div className="overflow-x-auto">
                    <Table className="mt-2">
                        <Table.Head>
                            <Table.HeadCell>Order ID</Table.HeadCell>
                            <Table.HeadCell>Supplier</Table.HeadCell>
                            <Table.HeadCell>Address</Table.HeadCell>
                            <Table.HeadCell>Phone</Table.HeadCell>
                            <Table.HeadCell></Table.HeadCell>
                        </Table.Head>
                        <Table.Body>
                            {pickupStops.map((stop, index) => (
                                <Table.Row key={index}>
                                    <Table.Cell>{stop._id}</Table.Cell>
                                    <Table.Cell className='text-nowrap'>{stop.supplier?.name}</Table.Cell>
                                    <Table.Cell >{stop.supplier.pickupLocation.address}</Table.Cell>
                                    <Table.Cell>
                                        <Popover content={popupPhoneContent(stop.supplier?.phoneNumber1)} trigger="hover">
                                            <Button size="sm" color={'blue'} className='rounded-full'><MdPhone /></Button>
                                        </Popover></Table.Cell>
                                    <Table.Cell>
                                        <IoMdTrash className='text-2xl text-red-700 cursor-pointer' onClick={() => handleRemovePickupStop(stop._id)} />
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </div>
            </div>

            <div>
                <Label htmlFor="start">Start Location</Label>
                <AutocompleteSupplier onSelect={setStart} value={start} isForLocation={true} />
            </div>

            <div>
                <Label htmlFor="end">End Location</Label>
                <AutocompleteSupplier onSelect={setEnd} value={end} isForLocation={true} />
            </div>

            <button className='w-full cursor-pointer bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700' type="submit">Create Route</button>
        </form>
    );
};

export default CreateRoute;