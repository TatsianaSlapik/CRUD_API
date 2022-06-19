import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { PORT } from "./src/common/config";
import { IUserBody } from "./src/data/user.interface";
import users from "./src/data/users";
import {
  createUser,
  deleteUser,
  getId,
  getUser,
  isValidId,
  updateUser,
} from "./src/util/util";

const server = createServer(
  (request: IncomingMessage, response: ServerResponse) => {
    if (request.url !== undefined) {
      if (request.url === "/api/users") {
        if (request.method === "GET") {
          response.end(JSON.stringify(users));
        }
        if (request.method === "POST") {
          let body = "";
          request.on("data", function (data) {
            body += data;
          });
          request.on("end", function () {
            try {
              const { name, age, hobbies } = JSON.parse(body);

              const newUser: IUserBody = {
                name: name,
                age: age,
                hobbies: hobbies,
              };
              if (newUser.name && newUser.age && newUser.hobbies) {
                let post = createUser(newUser);
                response.writeHead(201, { "Content-Type": "text/plain" });
                response.end(JSON.stringify(post));
              } else {
                response.writeHead(400, { "Content-Type": "application/json" });
                response.end(
                  JSON.stringify({
                    message: "Request body does not contain required fields",
                  })
                );
              }

              return;
            } catch (err) {
              response.writeHead(500, { "Content-Type": "text/plain" });
              response.write("Bad Post Data.  Is your data a proper JSON?\n");
              response.end();
              return;
            }
          });
        }
      } else if (request.url.match(/\/api\/users\/\w+/)) {
        if (request.method === "GET") {
          const id = getId(request.url);

          try {
            if (isValidId(id)) {
              const user = getUser(id);

              if (!user) {
                response.writeHead(404, { "Content-Type": "application/json" });
                response.end(JSON.stringify({ message: "User Not Found" }));
              } else {
                response.writeHead(200, { "Content-Type": "application/json" });
                response.end(JSON.stringify(user));
              }
            } else {
              response.writeHead(400, { "Content-Type": "application/json" });
              response.end(
                JSON.stringify({ message: "UserId is invalid (not uuid)" })
              );
            }
          } catch (err) {
            response.writeHead(500, { "Content-Type": "text/plain" });
            response.write("Bad Post Data.  Is your data a proper JSON?\n");
            response.end();
            return;
          }
        }
        if (request.method === "DELETE") {
          const id = getId(request.url);

          try {
            if (isValidId(id)) {
              const user = getUser(id);
              if (!user) {
                response.writeHead(404, { "Content-Type": "application/json" });
                response.end(JSON.stringify({ message: "User Not Found" }));
              } else {
                deleteUser(id);
                response.writeHead(204, { "Content-Type": "text/plain" });
                response.end(JSON.stringify({ message: `User ${id} removed` }));
              }
            } else {
              response.writeHead(400, { "Content-Type": "application/json" });
              response.end(
                JSON.stringify({ message: "UserId is invalid (not uuid)" })
              );
            }
          } catch (err) {
            response.writeHead(500, { "Content-Type": "text/plain" });
            response.write("Bad Post Data.  Is your data a proper JSON?\n");
            response.end();
            return;
          }
        }
        if (request.method === "PUT") {
          const id = getId(request.url);
          let body = "";
          request.on("data", function (data) {
            body += data;
          });
          request.on("end", function () {
            try {
              if (isValidId(id)) {
                const user = getUser(id);
                if (!user) {
                  response.writeHead(404, {
                    "Content-Type": "application/json",
                  });
                  response.end(JSON.stringify({ message: "User Not Found" }));
                } else {
                  const { name, age, hobbies } = JSON.parse(body);

                  const newInfoAboutUser: IUserBody = {
                    name: name || user.name,
                    age: age || user.age,
                    hobbies: hobbies || user.hobbies,
                  };
                  let updateInfoUser = updateUser(id, newInfoAboutUser);
                  response.writeHead(200, {
                    "Content-Type": "application/json",
                  });
                  response.end(JSON.stringify(updateInfoUser));
                }
              } else {
                response.writeHead(400, { "Content-Type": "application/json" });
                response.end(
                  JSON.stringify({ message: "UserId is invalid (not uuid)" })
                );
              }
            } catch (err) {
              response.writeHead(500, { "Content-Type": "text/plain" });
              response.write("Bad Post Data.  Is your data a proper JSON?\n");
              response.end();
              return;
            }
          });
        }
      } else {
        response.statusCode = 404;
        response.end();
      }
    }
  }
);

server.listen(PORT, () =>
  process.stdout.write(`Server is running on http://localhost:${PORT}\n`)
);
