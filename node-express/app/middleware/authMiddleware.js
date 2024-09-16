import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from '../config/config.js';

export const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ message: `Access denied. No token provided.${err.message}` });
    }

    const token = authHeader.replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: `Invalid token${err.message}` });
    }
};