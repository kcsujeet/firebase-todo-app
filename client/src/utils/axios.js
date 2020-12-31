import axios from 'axios'

const axiosConfig = {
    baseURL: 'https://us-central1-fir-todoapp-7eeb2.cloudfunctions.net/api',
    timeout: 10000
}

const axiosInstance = axios.create(axiosConfig)

// Request interceptor for API calls
axiosInstance.interceptors.request.use(
    config => {
        config.headers = { 
            'Authorization': localStorage.getItem('todo_app_auth_token'),
        }
        return config;
    }
);

export default axiosInstance