//Main file for our guitars module

// define our routes here, and export them to app.js this would be more clearner way instaed  of setting routes in app.js
import {Router} from 'express';

export const guitarRoutes = new Router();

const guitars = [
    {id: 1, make: 'Fender', model: 'Stratocaster'},
    {id: 2, make: 'Gibson', model: 'Les Paul'},
    {id: 3, make: 'Ibanez', model: 'RG'},
    {id: 4, make: 'Jackson', model: 'Soloist'},
    {id: 5, make: 'ESP', model: 'Eclipse'},
    {id: 6, make: 'Gibson', model: 'Custom 24'}
]

// /guitars will be the route for all guitars
guitarRoutes.get('/', (req,res)=>{
    res.send(guitars);
});

//routes paramerters
guitarRoutes.get('/:id', (req,res)=>{
    const id =  parseInt(req.params.id, 10);
    // handling if id or by make, in URL  it should be /guitars/1 or /guitars/Fender
    if(id){
        //handle by id
        const guitar = guitars.find(g => g.id === id);
        //handle if id or guitar is not found
        if(!guitar){
            res.sendStatus(404);
        }
        else{
            res.send(guitar);
        }
    }else{
        //handle by make
        const makeFound = guitars.filter(g => g.make.toLowerCase() === req.params.id.toLowerCase());
        if(makeFound.length === 0){
            res.sendStatus(404);
        }
        else{
            res.send(makeFound);
        }
    }
});