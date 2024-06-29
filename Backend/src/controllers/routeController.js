

const RouteService = require('../services/routeService');
// const OPRoute = require("../config/models/optimizedRoute")
const axios = require("axios")

const RouteController = {
    createRoute: async (req, res) => {
        try {
            const route = await RouteService.createRoute(req.body);
            return res.status(201).json({ status: true, data: route, err: {} });
        } catch (error) {
            res.status(500).json({ status: false, data: {}, err: error.message });
        }
    },

    getAllRoutes: async (req, res) => {
        try {
            const routes = await RouteService.getAllRoutes();
            console.log("here", routes)
            let routemap = routes.map(route => {
                let pickupStops = route.pickupStops.map(stop => {
                    console.log(stop)
                    return { ...stop._doc, supplier: stop.supplierID }
                })
                return { ...route._doc, pickupStops }
            })

            return res.status(200).json({ status: true, data: routemap, err: {} });
        } catch (error) {
            res.status(500).json({ status: false, data: {}, err: error.message });
        }
    },

    getRouteById: async (req, res) => {
        try {
            const route = await RouteService.getRouteById(req.params.id);
            if (!route) {
                return res.status(404).json({ status: true, data: {}, err: 'Route not found' });
            }
            return res.status(200).json({ status: true, data: route, err: {} });
        } catch (error) {
            res.status(500).json({ status: false, data: {}, err: error.message });
        }
    },

    updateRoute: async (req, res) => {
        try {
            const route = await RouteService.updateRoute(req.params.id, req.body);
            if (!route) {
                return res.status(404).json({ status: true, data: {}, err: 'Route not found' });
            }
            return res.status(201).json({ status: true, data: route, err: {} });
        } catch (error) {
            res.status(500).json({ status: false, data: {}, err: error.message });
        }
    },

    // Optimize the route using RouteXL API
    // createOptimizedRoute: async (req, res) => {
    //     const { name, stops } = req.body;
    //     console.log(name, stops)
    //     try {
    //         const response = await axios.post('https://api.routexl.com/v2/tour', {
    //             locations: stops
    //         }, {
    //             auth: {
    //                 username: process.env.ROUTEXL_USER,
    //                 password: process.env.ROUTEXL_PASS
    //             }
    //         }).catch(err=>console.log(err))
    //         console.log(response)
    //         const optimizedStops = response.data.route;
    //         const newRoute = new OPRoute({ name, stops, optimizedStops });
    //         await newRoute.save();

    //         res.status(201).json({ status: true, data: newRoute, err: {} });
    //     } catch (error) {
    //         console.log(error)
    //         res.status(500).json({ message: 'Error optimizing route', error: error.message });
    //     }
    // },

    // getOptimizedRoutes: async (req, res) => {
    //     try {
    //         const routes = await OPRoute.find();
    //         res.json({ status: true, data: routes, err: {} });
    //     } catch (error) {
    //         res.status(500).json({ status: false, data: {}, err: error.message });
    //     }
    // },

    // getOptimizedRouteById: async (req, res) => {
    //     try {
    //         const route = await OPRoute.findById(req.params.id);
    //         if (!route) {
    //             return res.status(404).json({ message: 'Route not found' });
    //         }
    //         res.json({ status: true, data: route, err: {} });
    //     } catch (error) {
    //         res.status(500).json({ status: false, data: {}, err: error.message });
    //     }
    // },

};

module.exports = RouteController;

