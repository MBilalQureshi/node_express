// Assume this data is the model
const guitars = [
    {id: 1, make: 'Fender', model: 'Stratocaster'},
    {id: 2, make: 'Gibson', model: 'Les Paul'},
    {id: 3, make: 'Ibanez', model: 'RG'},
    {id: 4, make: 'Jackson', model: 'Soloist'},
    {id: 5, make: 'ESP', model: 'Eclipse'},
    {id: 6, make: 'Gibson', model: 'Custom 24'}
]

// List all guitars
export function listGuitars(req,res){
    res.send(guitars);
}

// List guitar based on id or guitars based on make
export function showGuitar(req,res){
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
}