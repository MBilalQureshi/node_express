import express from 'express';
import multer from 'multer';
import path from 'path'
import { fileURLToPath } from 'url';
import { uploadCsv } from '../controller/uploadController.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.resolve(__dirname, '../uploads');
const upload = multer({ dest: uploadDir });

router.post('/upload-csv', upload.single('file'), uploadCsv);

export default router;