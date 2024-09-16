import express from 'express';
import {guitarRoutes} from './guitars/routes.js';
import uploadRoutes from './multer_csv/route/uploadRoute.js';
import readCsvRoutes from './multer_csv/route/readCsvRoute.js';

// User
import userRoutes from './user_data/route/userRoute.js';
import './user_data/config/db.js';

// Auth
import authRoutes from './user_data/route/authRoute.js';

const app = express();
app.use(express.json());

//guitar routes
app.use('/guitars', guitarRoutes);
app.get('/', (req, res)=>{
    res.send('Home Page')
})
// Upload routes
app.use('/', uploadRoutes);
app.use('/', readCsvRoutes);
// simple addition using app.get
// app.get('/add/:num1/:num2',(req,res)=>{
app.get('/add/:num1-:num2',(req,res)=>{
    res.send(`${parseInt(req.params.num1)+ parseInt(req.params.num2)}`)
})

// app.get('/about', (req, res)=>{
//     res.send('About Page')
// });

// Use the user routes
app.use('/', userRoutes);

app.use('/', authRoutes);

export function startServer(){
    app.listen(80, () => {
        console.log('Listening on port 80 at http://localhost');
    });
}
