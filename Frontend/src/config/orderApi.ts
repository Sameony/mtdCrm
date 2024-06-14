import axios from "axios";
import { apiUrl } from "./api/apiUrl";


const getAllOrders = async () => {
    return await axios.get(apiUrl.getAllOrders)
}

const getOrderByID = async (body:any) => {
    return await axios.post(apiUrl.getOrderByID,body)
}

const createOrder = async (body:any) => {
    return await axios.post(apiUrl.addOrder,body)
}

const getAllProducts = async () => {
    return await axios.get(apiUrl.getAllProducts)
}




export const orderApis = {
    getAllOrders,
    getOrderByID,
    createOrder,
    getAllProducts
}