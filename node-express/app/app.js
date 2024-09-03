import express from 'express';
import {guitarRoutes} from './guitars/index.js';

const app = express();

app.use('/guitars', guitarRoutes);
app.get('/', (req, res)=>{
    res.send('Home Page')
})

// app.get('/about', (req, res)=>{
//     res.send('About Page')
// });

export function startServer(){
    app.listen(80, () => {
        console.log('Listening on port 80 at http://localhost');
    });
}
