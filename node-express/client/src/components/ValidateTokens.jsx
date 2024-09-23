import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../interceptors/axiosInstance.js';

const ValidateTokens = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        // Check if tokens are present
        if (!accessToken || !refreshToken) {
            console.log('No tokens found');
            navigate('/signin');
            return;
        }

        // Tokens exist so now check if access token is expired or not
        try {
            // Decode the access token to extract its payload
            const decodedAccessToken = jwtDecode(accessToken);
            const currentTime = Date.now() / 1000;

            // Check if the access token has expired
            if (decodedAccessToken.exp < currentTime) {
                // Access token is expired, try to refresh it
                axiosInstance.post('/refresh-token', { refreshToken: refreshToken })
                  .then(response => {
                    const { accessToken: newAccessToken } = response.data;
                    localStorage.setItem('accessToken', newAccessToken);
                  })
                  .catch(() => {
                    alert('Refresh Token expired, please log in again');
                    navigate('/signin');
                  });
            }
        } catch (err) {
            console.log('Error validating tokens');
            navigate('/signin');
        }
    }, [navigate]);

    return children;
};

export default ValidateTokens;