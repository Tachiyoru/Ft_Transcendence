import axios from 'axios'


const backendUrl = import.meta.env.REACT_APP_URL_BACKEND as string

const axiosInstance = axios.create({
    baseURL: backendUrl,
    withCredentials: true,
})

export default axiosInstance