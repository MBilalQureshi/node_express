import axios from 'axios';
// import jwtDecode from 'jwt-decode';

// Create an axios instance, This instance will be used for all HTTP requests in the application.
const axiosInstance = axios.create({
  baseURL: 'http://localhost:80',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Variables for Handling Token Refresh
let isRefreshing = false;
let failedQueue = [];

// Function to Process the Queue
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

//Request Interceptor
axiosInstance.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
            console.log('Access Token found');
        }
        return config;
    },
    error => {
        Promise.reject(error);
    }
);

//Response Interceptor
axiosInstance.interceptors.response.use(
    response => {
      return response;
    },
    async error => {
      const originalRequest = error.config;
      console.log('response',originalRequest);
      const refreshToken = localStorage.getItem('refreshToken');
      console.log('response',refreshToken);
      if (error.response.status === 401 && !originalRequest._retry && refreshToken) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(token => {
              originalRequest.headers['Authorization'] = 'Bearer ' + token;
              return axiosInstance(originalRequest);
            })
            .catch(err => {
              return Promise.reject(err);
            });
        }
  
        originalRequest._retry = true;
        isRefreshing = true;
  
        return new Promise((resolve, reject) => {
          axios.post('http://localhost:80/refresh-token', { refreshToken: refreshToken })
            .then(({ data }) => {
              localStorage.setItem('accessToken', data.accessToken);
              axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + data.accessToken;
              originalRequest.headers['Authorization'] = 'Bearer ' + data.accessToken;
              processQueue(null, data.accessToken);
              resolve(axiosInstance(originalRequest));
              console.log('Access Token Refreshed');
            })
            .catch((err) => {
              processQueue(err, null);
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              window.location.href = '/signin';
              reject(err);
            })
            .finally(() => {
              isRefreshing = false;
            });
        });
      }
  
      return Promise.reject(error);
    }
  );

export default axiosInstance;