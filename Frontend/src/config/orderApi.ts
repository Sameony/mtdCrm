import axios from "axios";
import { apiUrl } from "./api/apiUrl";


const getAllOrders = async () => {
    return await axios.get(apiUrl.getAllOrders)
}

const getOrderByID = async (param:any) => {
    return await axios.post(`${apiUrl.getOrderByID}/${param}`)
}

const createOrder = async (body:any) => {
    return await axios.post(apiUrl.addOrder,body)
}

const updateOrder = async (param:any, body:any) => {
    return await axios.post(`${apiUrl.updateOrder}/${param}`,body)
}
const getAllProducts = async () => {
    return await axios.get(apiUrl.getAllProducts)
}
const getProductById = async (param:any) => {
    return await axios.get(`${apiUrl.getProductById}/${param}`)
}
const updateProduct = async (param:any,body:any) => {
    return await axios.post(`${apiUrl.updateProduct}/${param}`, body)
}
const createProduct = async (body:any) => {
    return await axios.post(apiUrl.createProduct, body)
}
const createBulkProduct = async (body:any) => {
    return await axios.post(apiUrl.uploadBulkProduct, body)
}
const addPaymentToOrder = async (param:any, body:any) =>{
    return await axios.post(`${apiUrl.addPaymentToOrder}/${param}`,body)
}
const getPaymentById = async (param:any) => {
    return await axios.get(`${apiUrl.getPaymentByID}/${param}`)
}


export const orderApis = {
    getAllOrders,
    getOrderByID,
    createOrder,
    getAllProducts,
    addPaymentToOrder,
    updateOrder,
    getPaymentById,
    getProductById,
    updateProduct,
    createProduct,
    createBulkProduct
}