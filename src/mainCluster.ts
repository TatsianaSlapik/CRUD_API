import cluster from "node:cluster";
import http from "node:http";
import { cpus } from "node:os";
import process from "node:process";
import { PORT } from "./common/config";
import { handleReqRes } from "./handlereq";

const numCPUs = cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  http.createServer(handleReqRes).listen(PORT);

  console.log(`Worker ${process.pid} started`);
}
