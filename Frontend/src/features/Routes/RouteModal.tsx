import React, { useState } from 'react';
import { Button, Modal, Table } from 'flowbite-react';
import { Route } from '../../config/models/route';
import Map from '../../util/GoogleOptimizedRoute';
import { FaChevronLeft } from 'react-icons/fa6';

interface RouteDetailModalProps {
    route: Route | null;
    isOpen: boolean;
    onClose: () => void;
}

const RouteDetailModal: React.FC<RouteDetailModalProps> = ({ route, isOpen, onClose }) => {
    const [showRoute, setShowRoute] = useState<boolean>(false)
    const delStops = (route?.deliveryStops ?? []).flatMap(item =>
        `${item.ship_address.address}`
    );
    const pickStops = (route?.pickupStops ?? []).flatMap(item => item.supplier.pickupLocation.address);
    const start = route?.start?.pickupLocation.address ?? ""
    const end = route?.end?.pickupLocation.address ?? ""
    const route_obj = {
        name: route?.routeID ?? route?.routeName,
        stops: [...pickStops, ...delStops],
    };

    if (!route) return null;
    console.log(route_obj)
    return (
        <Modal show={isOpen} onClose={onClose} size="7xl">
            <Modal.Header>Route Details</Modal.Header>
            <Modal.Body>
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium">Basic Information</h3>
                        <div className="max-w-96 overflow-x-auto">
                            <Table >
                                <Table.Body>
                                    <Table.Row>
                                        <Table.Cell className="font-medium">Route Name</Table.Cell>
                                        <Table.Cell>{route.routeName}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell className="font-medium">Route Date</Table.Cell>
                                        <Table.Cell>{new Date(route.routeDate).toLocaleDateString()}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell className="font-medium">Route ID</Table.Cell>
                                        <Table.Cell>{route.routeID}</Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            </Table>
                        </div>
                    </div>

                    <div className={`${!showRoute ? "" : "hidden"} space-y-6`}>
                        <div>
                            <h3 className="text-lg font-medium">Delivery Stops</h3>
                            <div className="overflow-x-auto">
                                <Table>
                                    <Table.Head>
                                        <Table.HeadCell className='w-1/4'>Order ID</Table.HeadCell>
                                        <Table.HeadCell className='w-1/4'>Customer</Table.HeadCell>
                                        <Table.HeadCell className='w-2/4'>Address</Table.HeadCell>
                                    </Table.Head>
                                    <Table.Body>
                                        {route.deliveryStops.map((stop) => (
                                            <Table.Row key={stop._id}>
                                                <Table.Cell>{stop._id}</Table.Cell>
                                                <Table.Cell>{stop.customer.firstname + " " + stop.customer.lastname}</Table.Cell>
                                                <Table.Cell>{stop.ship_address.address}</Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium">Pickup Stops</h3>
                            <div className="overflow-x-auto">
                                <Table>
                                    <Table.Head>
                                        <Table.HeadCell className='w-1/4'>Order ID</Table.HeadCell>
                                        <Table.HeadCell className='w-1/4'>Supplier</Table.HeadCell>
                                        <Table.HeadCell className='w-2/4'>Address</Table.HeadCell>
                                    </Table.Head>
                                    <Table.Body>
                                        {route.pickupStops?.map((stop) => (
                                            <Table.Row key={stop._id}>
                                                <Table.Cell>{stop._id}</Table.Cell>
                                                <Table.Cell>{stop.supplier.name}</Table.Cell>
                                                <Table.Cell>{stop.supplier.pickupLocation.address}</Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium">Start and End Locations</h3>
                            <Table>
                                <Table.Body>
                                    <Table.Row>
                                        <Table.Cell className="font-medium">Start Location</Table.Cell>
                                        <Table.Cell>{route.start?.name}</Table.Cell>
                                        <Table.Cell>{route.start?.pickupLocation.address}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell className="font-medium">End Location</Table.Cell>
                                        <Table.Cell>{route.end?.name}</Table.Cell>
                                        <Table.Cell>{route.end?.pickupLocation.address}</Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            </Table>
                        </div>
                        <button className="w-full cursor-pointer bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700"
                            onClick={() => setShowRoute(true)}
                        >

                            Get Optimized Route
                        </button>
                    </div>
                    <div className={`${showRoute ? "" : "hidden"}`}>
                        <div className='flex items-center justify-between mb-5'>
                            <h1>Optimized Route Map</h1>
                            <Button className='' color={'gray'} onClick={() => setShowRoute(false)}>
                                <span className='flex gap-2 items-center'><FaChevronLeft />View Route details</span>
                            </Button>
                        </div>
                        <Map start={start} end={end} waypoints={route_obj.stops} />
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default RouteDetailModal;