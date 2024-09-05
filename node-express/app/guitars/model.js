// Assume this data is the model, will use MongoDB later
const guitars = [
    {id: 1, make: 'Fender', model: 'Stratocaster'},
    {id: 2, make: 'Gibson', model: 'Les Paul'},
    {id: 3, make: 'Ibanez', model: 'RG'},
    {id: 4, make: 'Jackson', model: 'Soloist'},
    {id: 5, make: 'ESP', model: 'Eclipse'},
    {id: 6, make: 'Gibson', model: 'Custom 24'}
]

// As the task perofmed with MongoDB will be using Async/Await, use it for static data as well for consistency
export function getAll(){
    return Promise.resolve(guitars);
    // return new Promise((resolve, reject) => {
    //     resolve(guitars);
    // });
}

//Guitar get by id
export function getById(id){
    return Promise.resolve(guitars.find(g=>g.id === id))
}

//Guitar(s) get by make
export function getByMake(make){
    return Promise.resolve(guitars.filter(g=>g.make.toLowerCase() === make.toLowerCase()))
}