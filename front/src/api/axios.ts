import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://10.0.2.2:4000/', // Replace with your API base URL
  //baseURL: 'http://localhost:4000/', // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json'
  }
});


instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      console.log('token in local storege', token);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export default instance;