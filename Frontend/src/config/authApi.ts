import axios from "axios";
import { apiUrl } from "./api/apiUrl";


const postLogin = async (body:any) => {
    return await axios.post(apiUrl.login,body)
}


export const authApis = {
    postLogin
}