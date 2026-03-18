import axios from "axios"
import {AUTH_TOKEN} from "@/common/constants";

export const instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
        "API-KEY": import.meta.env.VITE_API_KEY,
    },
})


instance.interceptors.request.use(function (config) {
        const newToken = localStorage.getItem(AUTH_TOKEN)
        if (newToken){
            config.headers.Authorization = `Bearer ${newToken}`
        }
        return config
    },
)