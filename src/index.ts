// Cluster.isMaster (or cluster.isPrimary)
// Checks if the current process is the master/primary process.
// Cluster.isWorker
// Checks if the current process is a worker process.
// Cluster.fork()
// Creates a new worker process.
// Worker.process
// Provides access to the worker process instance (process object of the worker).
// Worker.id
// Unique ID for each worker (starting from 1).
// Worker.send(message)
// Sends a message to the worker.
// Process.on('message')
// Listens for messages sent from the master process or another worker.
// Cluster.on('exit')
// Listens for the exit event to detect when a worker dies.
// os.cpus()
// Returns an array representing each CPU core available on the machine.

import cluster from 'cluster';
import express from 'express';

import os from 'os';




const app=express()
if (cluster.isPrimary) {
  // This block runs in the primary process
  console.log(`Primary process PID: ${process.pid}`);

  // Fork workers equal to the number of CPU cores
  const numCPUs = os.cpus().length;
  console.log(os.cpus().length," there are this number of cpus");
  for (let i = 0; i < numCPUs; i++) {
    console.log("i am forking....")
    cluster.fork();
  }

  // Log when a worker exits
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} exited. Code: ${code}, Signal: ${signal}`);
    // Optionally restart the worker
    cluster.fork();
  });

} else {
  // This block runs in the worker process
//   http.createServer((req, res) => {
//     res.writeHead(200);
//     res.end(`Response from worker PID: ${process.pid}`);
//   }).listen(8000);

//   console.log(`Worker process PID: ${process.pid} started`);
app.use('/',(req,res,next)=>{
    res.json({message:"hello server is live"})
})


}
app.listen(8000,()=>{console.log("server is live")})
