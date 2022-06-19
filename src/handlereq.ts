import { IncomingMessage, ServerResponse } from "http";
import { IUserBody } from "./data/user.interface";
import users from "./data/users";
import {
  createUser,
  deleteUser,
  getId,
  getUser,
  isValidId,
  updateUser,
} from "./util/util";

export function handleReqRes(
  request: IncomingMessage,
  response: ServerResponse
) {
  if (request.url !== undefined) {
    if (request.url === "/api/users") {
      if (request.method === "GET") {
        response.setHeader("Content-Type", "application/json");
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
              response.writeHead(201, { "Content-Type": "application/json" });
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
              response.writeHead(204, { "Content-Type": "application/json" });
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
            response.writeHead(500, { "Content-Type": "application/json" });
            response.write("Bad Post Data.  Is your data a proper JSON?\n");
            response.end();
            return;
          }
        });
      }
    } else {
      //response.statusCode = 404;
      response.writeHead(404, { "Content-Type": "application/json" });
      response.write("OOps");
      response.end();
    }
  }
}
