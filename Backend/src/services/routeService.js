const Route = require('../config/models/routeModel');

const RouteService = {
    createRoute: async (data) => {
        try {
            const { routeId, date, sequence } = await RouteService.generateRouteId();

            const newRoute = new Route({
                ...data,
                routeID: routeId,
                date: date,
                sequence: sequence,
            });

            await newRoute.save();
            return newRoute;
        } catch (error) {
            throw error;
        }
    },
    generateRouteId: async () => {
        const currentDate = new Date();
        const day = currentDate.getDate().toString().padStart(2, '0');
        const month = currentDate.toLocaleString('default', { month: 'short' }).toUpperCase();
        const year = currentDate.getFullYear();
        const dateStr = `${day}${month}${year}`;

        // Find the latest sequence number for today
        const latestRoute = await Route.findOne({ date: dateStr }).sort({ sequence: -1 });
        const sequence = latestRoute ? latestRoute.sequence + 1 : 1;

        // Determine the alphabet sequence based on the sequence number
        let alphabet = '';
        let seq = sequence;

        while (seq > 0) {
            seq--; // Adjust because A starts from 0, not 1
            alphabet = String.fromCharCode(65 + (seq % 26)) + alphabet;
            seq = Math.floor(seq / 26);
        }

        return {
            routeId: `R${dateStr}${alphabet}`,
            date: dateStr,
            sequence: sequence
        };
    },

    getAllRoutes: async () => {
        try {
            return await Route.find()
                .populate({
                    path: 'deliveryStops',
                    populate: [
                        { path: 'customer' },
                        {
                            path: 'products.product_id',
                            model: 'Product'
                        },
                        {
                            path: 'payments'
                        }
                    ]
                })
                .populate({
                    path: 'pickupStops',
                    populate: [
                        { path: 'supplierID' },
                        { path: 'orderID' }
                    ]
                })
                .populate('start')
                .populate('end');
        } catch (error) {
            throw error;
        }
    },

    getRouteById: async (routeId) => {
        try {
            return await Route.findById(routeId)
                .populate({
                    path: 'deliveryStops',
                    populate: [
                        { path: 'customer' },
                        {
                            path: 'products.product_id',
                            model: 'Product'
                        },
                        {
                            path: 'payments'
                        }
                    ]
                })
                .populate({
                    path: 'pickupStops',
                    populate: [
                        { path: 'supplierID' },
                        { path: 'orderID' }
                    ]
                })
                .populate('start')
                .populate('end');
        } catch (error) {
            throw error;
        }
    },

    updateRoute: async (routeId, data) => {
        try {
            const updatedRoute = await Route.findByIdAndUpdate(routeId, data, { new: true });
            return updatedRoute;
        } catch (error) {
            throw error;
        }
    },
};

module.exports = RouteService;
