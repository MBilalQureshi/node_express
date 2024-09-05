import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Make directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

export const uploadCsv = (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }else if (req.file.mimetype !== 'text/csv') {
        return res.status(400).send('Invalid file type. Please upload a CSV file.');
    }else if ( req.files && req.files.length > 1) {
        return res.status(400).send('Please upload exactly one file.');
    }
    const results = [];
    const filePath = path.join(uploadsDir, req.file.filename);

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            res.send(results);
        })
        .on('error', (err) => {
            console.error(`Error reading file: ${err.message}`);
            res.status(500).send(`Error reading file: ${err.message}`);
        });
};