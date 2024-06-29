import React, { useState, useEffect } from 'react';
import { Table, Button, Spinner } from 'flowbite-react';
import { routeApis } from '../../config/routeApi';
import { Route } from '../../config/models/route';
import RouteDetailModal from './RouteModal';

const ViewRoutes: React.FC = () => {
    const [routes, setRoutes] = useState<Route[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchRoutes();
    }, []);

    const fetchRoutes = async () => {
        try {
            setLoading(true);
            const response = await routeApis.getAllRoutes();
            if (response.data.status) {
                setRoutes(response.data.data);
            } else {
                setError(response.data.err || 'Failed to fetch routes');
            }
        } catch (err) {
            setError('An error occurred while fetching routes');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    const handleViewDetails = (route: Route) => {
        setSelectedRoute(route);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRoute(null);
    };
    const handleEdit = (routeId: string) => {
        // Implement edit logic (e.g., navigate to an edit page)
        console.log(`Edit route ${routeId}`);
    };

    //   const handleDelete = async (routeId: string) => {
    //     if (window.confirm('Are you sure you want to delete this route?')) {
    //       try {
    //         await routeApis.deleteRoute(routeId);
    //         setRoutes(routes.filter(route => route._id !== routeId));
    //       } catch (err) {
    //         console.error('Failed to delete route:', err);
    //         setError('Failed to delete route');
    //       }
    //     }
    //   };

    if (loading) {
        return <Spinner aria-label="Loading routes" />;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Routes</h1>
            <div className="overflow-x-auto">
                <Table>
                    <Table.Head>
                        <Table.HeadCell>Route Name</Table.HeadCell>
                        <Table.HeadCell>Route Date</Table.HeadCell>
                        <Table.HeadCell>Delivery Stops</Table.HeadCell>
                        <Table.HeadCell>Pickup Stops</Table.HeadCell>
                        <Table.HeadCell>Start</Table.HeadCell>
                        <Table.HeadCell>End</Table.HeadCell>
                        <Table.HeadCell>Actions</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {routes.map((route) => (
                            <Table.Row key={route._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {route.routeName}
                                </Table.Cell>
                                <Table.Cell>{new Date(route.routeDate).toLocaleDateString()}</Table.Cell>
                                <Table.Cell>{route.deliveryStops.length}</Table.Cell>
                                <Table.Cell>{route.pickupStops.length}</Table.Cell>
                                <Table.Cell>{route.start?.name}</Table.Cell>
                                <Table.Cell>{route.end?.name}</Table.Cell>
                                <Table.Cell>
                                    <div className="flex justify-center space-x-2">
                                        <button className="w-full cursor-pointer bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700" onClick={() => handleViewDetails(route)}>
                                            View
                                        </button>
                                        <Button size="sm" color="warning" onClick={() => handleEdit(route._id)}>
                                            Edit
                                        </Button>
                                        {/* <Button size="sm" color="failure" onClick={() => handleDelete(route._id)}>
                    Delete
                  </Button> */}
                                    </div>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>
            <RouteDetailModal
                route={selectedRoute}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />

        </div>
    );
};

export default ViewRoutes;