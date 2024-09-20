import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const ValidateTokens = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        console.log('accessToken:', accessToken);
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
            console.log('decodedAccessToken:', decodedAccessToken);
            const currentTime = Date.now() / 1000;
            console.log('decodedAccessToken:', decodedAccessToken);
            // Check if the access token has expired
            if (decodedAccessToken.exp < currentTime) {
                console.log('inside if');
                // Access token is expired, try to refresh it
                axios.post('http://localhost:80/refresh-token', { token: refreshToken })
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