import axios from "axios";
import {getStoredUser, setStoredUser} from "@/lib/utils.ts";

const axiosClient = axios.create({
    baseURL: '/api',
    withCredentials: true,
})

axiosClient.interceptors.request.use((config) => {
    const user = getStoredUser();
    config.headers.Authorization = `Bearer ${user?.token}`
    return config;
})

axiosClient.interceptors.response.use((response) => {
    return response
}, (error) => {
    const {response} = error;
    if (response.status === 401) {
        setStoredUser(null)
    } else {
        throw error;
    }
})

export default axiosClient
