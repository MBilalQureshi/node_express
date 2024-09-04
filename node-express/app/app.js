import express from 'express';
import {guitarRoutes} from './guitars/routes.js';

const app = express();

//guitar routes
app.use('/guitars', guitarRoutes);
app.get('/', (req, res)=>{
    res.send('Home Page')
})
// simple addition using app.get
// app.get('/add/:num1/:num2',(req,res)=>{
app.get('/add/:num1-:num2',(req,res)=>{
    res.send(`${parseInt(req.params.num1)+ parseInt(req.params.num2)}`)
})

// app.get('/about', (req, res)=>{
//     res.send('About Page')
// });

export function startServer(){
    app.listen(80, () => {
        console.log('Listening on port 80 at http://localhost');
    });
}
