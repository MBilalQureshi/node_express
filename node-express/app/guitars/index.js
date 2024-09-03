//Main file for our guitars module

// define our routes here, and export them to app.js this would be more clearner way instaed  of setting routes in app.js
import {Router} from 'express';

export const guitarRoutes = new Router();

const guitars = [
    {id: 1, make: 'Fender', model: 'Stratocaster'},
    {id: 2, make: 'Gibson', model: 'Les Paul'},
    {id: 3, make: 'Ibanez', model: 'RG'}
]

guitarRoutes.get('/', (req,res)=>{
    res.send(guitars);
})

guitarRoutes.get('/1', (req,res)=>{
    res.send(guitars[0]);
})