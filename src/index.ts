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

// differnece between cluster and worker
//_______________________________________
// Worker Threads: Share memory, run within the same process, and are suited for parallel 
// execution of CPU-bound tasks.

// Cluster Module: Do not share memory, run as separate processes on different CPU cores, 
// and are suited for scaling I/O-bound applications like web servers.

import cluster from 'cluster';
import { cpus } from 'os';

if (cluster.isPrimary) {
  console.log(`Primary process PID: ${process.pid}`);

  // Define ranges for workers
  const ranges = [
    { start: 1, end: 100000 },     // Worker 1 range
    { start: 100001, end: 200000 },
    {start:200001,end:300000} ,
    {start:300001,end:400000} // Worker 2 range
  ];

  // Fork workers and pass ranges as environment variables
  ranges.forEach((range, index) => {
    const worker = cluster.fork({
      START: range.start,
      END: range.end,
    });

    worker.on('message', (result: number) => {
      console.log(`Worker ${worker.process.pid} completed task ${index + 1} with result: ${result}`);
    });

    worker.on('exit', (code) => {
      if (code === 0) {
        console.log(`Worker ${worker.process.pid} finished successfully.`);
      } else {
        console.error(`Worker ${worker.process.pid} exited with code ${code}`);
      }
    });
  });
} else {
  // Worker process
  const start = parseInt(process.env.START || '0', 10);
  const end = parseInt(process.env.END || '0', 10);

  // Calculate sum for the assigned range
  let sum = 0;
  for (let i = start; i <= end; i++) {
    sum += i;
  }

  // Send the result back to the primary process
  if (process.send) {
    process.send(sum);
  }

  // Exit the worker
  process.exit(0);
}
