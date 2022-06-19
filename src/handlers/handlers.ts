import { IUserBody } from "../data/user.interface";
import users from "../data/users";
import {
  createUser,
  deleteUser,
  getId,
  getUser,
  isValidId,
  updateUser,
} from "../util/util";

export const handlerGetAllUsers = (response) => {
  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify(users));
};

export const handleCreateUser = (request, response) => {
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
};

export const handlerGetUserById = (request, response) => {
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
      response.end(JSON.stringify({ message: "UserId is invalid (not uuid)" }));
    }
  } catch (err) {
    response.writeHead(500, { "Content-Type": "text/plain" });
    response.write("Bad Post Data.  Is your data a proper JSON?\n");
    response.end();
    return;
  }
};

export const handlerDeleteUserById = (request, response) => {
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
      response.end(JSON.stringify({ message: "UserId is invalid (not uuid)" }));
    }
  } catch (err) {
    response.writeHead(500, { "Content-Type": "text/plain" });
    response.write("Bad Post Data.  Is your data a proper JSON?\n");
    response.end();
    return;
  }
};

export const handlerUpdateUserById = (request, response) => {
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
};

export const handlerPathBad = (response) => {
  response.writeHead(404, { "Content-Type": "application/json" });
  response.write({
    message: "Sorry, but this request is for non-existent endpoints.",
  });
  response.end();
};
