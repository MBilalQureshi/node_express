import express from 'express';
import multer from 'multer';
import { readCsv } from '../controller/readCsvController.js';

const router = express.Router();

const upload = multer();

router.post('/read-csv', upload.single('file'), readCsv);

export default router;