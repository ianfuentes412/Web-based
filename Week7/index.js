var http = require('node:http');


var cluster = require('node:cluster');
var process = require('node:process');
const numInstances = 2;

// Primary process
if (cluster.isPrimary) 
{
    console.log(`Primary ${process.pid} is running`);

    // Fork workers, i.e., child processes.
    for (let i = 0; i < numInstances; i++) {
        cluster.fork();
    }

    // 'exit' event listener
    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
        // Let's recreate a new worker.
        cluster.fork();
    });
}

// Child process
else 
{
    // Workers can share any TCP connection in the round-robin scheduling.
    // In the case of Node Web Server, it is an HTTP server.
    
    let server = require("./server.js");
    let router = require("./router.js");
    server.start(router);
    
    
    // This code is for testing.
    console.log(`Worker ${process.pid} started`);
    
    // one time timer
    setTimeout(function() {
        console.log(`Worker ${process.pid} done`);
        cluster.worker.kill();  // exit() in process; or cluster.worker.kill()
    }, Math.floor(Math.random() * 5000) + 2000);
    
}