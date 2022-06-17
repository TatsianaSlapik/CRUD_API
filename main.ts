import { createServer, IncomingMessage, ServerResponse } from "http";

const port = 3000;

const server = createServer(
  (request: IncomingMessage, response: ServerResponse) => {
    switch (request.url) {
      case "/api/users": {
        if (request.method === "GET") {
          response.end(JSON.stringify({ prop: "propv" }));
        }
        break;
      }
      default: {
        response.statusCode = 404;
        response.end();
      }
    }
  }
);

server.listen(port);
