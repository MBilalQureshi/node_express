import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import userRoutes from './user_data/route/userRoute.js';
import authRoutes from './user_data/route/authRoute.js';
import './user_data/config/db.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 80;

// Enable CORS
app.use(cors());

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/', userRoutes);
app.use('/', authRoutes);

// Serve static files from the React app
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// Handle any other requests by serving the React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Start the server
export function startServer() {
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT} at http://localhost`);
    });
}

// import express from 'express';
// import {guitarRoutes} from './guitars/routes.js';
// import uploadRoutes from './multer_csv/route/uploadRoute.js';
// import readCsvRoutes from './multer_csv/route/readCsvRoute.js';

// // User
// import userRoutes from './user_data/route/userRoute.js';
// import './user_data/config/db.js';

// // Auth
// import authRoutes from './user_data/route/authRoute.js';

// const app = express();
// app.use(express.json());

// //guitar routes
// app.use('/guitars', guitarRoutes);
// app.get('/', (req, res)=>{
//     res.send('Home Page')
// })
// // Upload routes
// app.use('/', uploadRoutes);
// app.use('/', readCsvRoutes);
// // simple addition using app.get
// // app.get('/add/:num1/:num2',(req,res)=>{
// app.get('/add/:num1-:num2',(req,res)=>{
//     res.send(`${parseInt(req.params.num1)+ parseInt(req.params.num2)}`)
// })

// // app.get('/about', (req, res)=>{
// //     res.send('About Page')
// // });

// // Use the user routes
// app.use('/', userRoutes);

// app.use('/', authRoutes);

// export function startServer(){
//     app.listen(80, () => {
//         console.log('Listening on port 80 at http://localhost');
//     });
// }
