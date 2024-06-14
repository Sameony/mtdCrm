import axios from "axios";
import { apiUrl } from "./api/apiUrl";

const addCustomer = async (body:any)=>{
    return await axios.post(apiUrl.addCustomer,body)
}

const getCustomers = async ()=>{
    return await axios.get(apiUrl.getCustomers)
}

export const customerApis = {
    addCustomer,
    getCustomers
}