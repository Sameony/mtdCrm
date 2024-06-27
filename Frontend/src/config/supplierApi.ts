import axios from "axios"
import { apiUrl } from "./api/apiUrl"

const getAllSuppliers = async () => {
    return await axios.get(apiUrl.getSupplier)
}
const getSupplierById = async (param:any) => {
    return await axios.get(`${apiUrl.getSupplier}/${param}`)
}
const updateSupplier = async (param:any,body:any) => {
    return await axios.post(`${apiUrl.updateSupplier}/${param}`, body)
}
const createSupplier = async (body:any) => {
    return await axios.post(apiUrl.createSupplier, body)
}
const createBulkSuppliers = async (body:any) => {
    return await axios.post(apiUrl.createMultiSupplier, body)
}
const getAllSupplierOrders= async () => {
    return await axios.get(apiUrl.getAllSupplierOrders);  
}
export const supplierApis = {
    getAllSuppliers,
    getSupplierById,
    updateSupplier,
    createSupplier,
    getAllSupplierOrders,
    createBulkSuppliers
}