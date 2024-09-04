import { getAll, getById, getByMake } from "./model.js";
// List all guitars
export async function listGuitars(req,res){
    const guitars = await getAll();
    res.send(guitars);
}

// List guitar based on id or guitars based on make
export async function showGuitar(req,res){
    const id =  parseInt(req.params.id, 10);
    // handling if id or by make, in URL  it should be /guitars/1 or /guitars/Fender
    if(id){
        //handle by id
        const guitar = await getById(id);
        //handle if id or guitar is not found
        if(!guitar){
            res.sendStatus(404);
        }
        else{
            res.send(guitar);
        }
    }else{
        //handle by make
        const makeFound = await getByMake(req.params.id);
        if(makeFound.length === 0){
            res.sendStatus(404);
        }
        else{
            res.send(makeFound);
        }
    }
}