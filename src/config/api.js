import axios from 'axios';

export const SERVER_URL = "http://localhost:9000"

const api = axios.create({
    baseURL: SERVER_URL, // replace with your actual base URL
});


export default api;