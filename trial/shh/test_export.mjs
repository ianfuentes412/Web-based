const prompt = import('prompt');

prompt.start();
prompt.get(['age','name'],function (err, result){
    console.log('Command-line input received:');

})

let age = result.age;
let name = result.name;
const print = () => { return `${name}'s age is ${age}.`; }
export {age, name, print};
