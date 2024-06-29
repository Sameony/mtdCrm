import axios from "axios"
import { apiUrl } from "./api/apiUrl"

const getAllRoutes = async () => {
    return await axios.get(apiUrl.route)
}
const getRouteById = async (param: any) => {
    return await axios.get(`${apiUrl.route}/${param}`)
}
const updateRoute = async (param: any, body: any) => {
    return await axios.post(`${apiUrl.updateRoute}/${param}`, body)
}
const createRoute = async (body: any) => {
    return await axios.post(apiUrl.route, body)
}

export const routeApis = {
    getAllRoutes,
    getRouteById,
    updateRoute,
    createRoute
}
