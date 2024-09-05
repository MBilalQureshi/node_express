import csv from 'csv-parser';
import { Readable } from 'stream';

export const readCsv = (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    } else if (req.file.mimetype !== 'text/csv') {
        return res.status(400).send('Invalid file type. Please upload a CSV file.');
    }

    const results = [];
    const stream = Readable.from(req.file.buffer);

    stream
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            res.json(results);
        })
        .on('error', (err) => {
            console.error(`Error reading file: ${err.message}`);
            res.status(500).send(`Error reading file: ${err.message}`);
        });
};