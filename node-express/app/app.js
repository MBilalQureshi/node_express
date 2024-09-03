import express from 'express';

const app = express();

app.get('/', (req, res)=>{
    res.send('Hello Express')
})

app.get('/about', (req, res)=>{
    res.send('About Page')
});

export function startServer(){
    app.listen(80, () => {
        console.log('Listening on port 80 at http://localhost');
    });
}
