import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../../config/config.js';

// Function to generate access token
const generateAccessToken = (user) => {
    return jwt.sign({ id: user.id, username: user.username }, ACCESS_TOKEN_SECRET, { expiresIn: '10m' });
};

// Refresh Token Endpoint
export const refreshToken = async (req, res) => {
    console.log('Received refresh token request');
    const { token } = req.body;
    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    console.log('Token provided:', token);
    try {
        const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
        console.log('Decoded token:', decoded);

        // Simulate user retrieval
        const user = { id: decoded.id, username: decoded.username, refreshToken: token };

        console.log('User found:', user);
        console.log('Stored refresh token:', user.refreshToken);
        console.log('Provided refresh token:', token);

        if (user.refreshToken !== token) {
            console.log('Stored refresh token does not match provided token');
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        const accessToken = generateAccessToken(user);
        res.status(200).json({ accessToken });
    } catch (err) {
        console.log('Error verifying token:', err);
        res.status(403).json({ message: `Invalid refresh token: ${err.message}` });
    }
};