import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: 'http://paul-f4ar2s4:5001',
    withCredentials: true,
})

export default axiosInstance