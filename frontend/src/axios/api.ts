import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5001',
    withCredentials: true
})

export default axiosInstance