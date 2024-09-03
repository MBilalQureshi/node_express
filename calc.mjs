// Using ECMAScript 6 which is becoming a statndard now
// ECMAScript file extension is .mjs
import * as readline from 'readline';
import { stdin as input, stdout as output } from 'process';

const rl = readline.createInterface({
    input,
    output
})

function question(query){
    return new Promise((resolve => {
        rl.question(query, resolve);
    }))
}

let answer = await question('Enter a simple question: ');

while(answer !== 'quit'){
    try{
        const value = eval(answer);
        console.log(value);
    }catch(err){
        console.log('Error: I dont know how to do that.', err.message);
    }
    answer = await question('Enter a simple question: ');
}

rl.close();