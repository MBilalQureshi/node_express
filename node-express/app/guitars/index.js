//Main file for our guitars module

// define our routes here, and export them to app.js this would be more clearner way instaed  of setting routes in app.js
import {Router} from 'express';

export const guitarRoutes = new Router();

const guitars = [
    {id: 1, make: 'Fender', model: 'Stratocaster'},
    {id: 2, make: 'Gibson', model: 'Les Paul'},
    {id: 3, make: 'Ibanez', model: 'RG'}
]

// /guitars will be the route for all guitars
guitarRoutes.get('/', (req,res)=>{
    res.send(guitars);
});

//routes paramerters
guitarRoutes.get('/:id', (req,res)=>{
    const id =  parseInt(req.params.id, 10);
    const guitar = guitars.find(g => g.id === id);
    
    //handle if id or guitar is not found
    if(!guitar){
        res.send(404);
    }
    else{
        res.send(guitar);
    }
    
});