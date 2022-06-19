import { IncomingMessage, ServerResponse } from "http";
import {
  handleCreateUser,
  handlerDeleteUserById,
  handlerGetAllUsers,
  handlerGetUserById,
  handlerPathBad,
  handlerUpdateUserById,
} from "./handlers/handlers";

export function handleReqRes(
  request: IncomingMessage,
  response: ServerResponse
) {
  if (request.url !== undefined) {
    if (request.url === "/api/users") {
      if (request.method === "GET") {
        handlerGetAllUsers(response);
      }
      if (request.method === "POST") {
        handleCreateUser(request, response);
      }
    } else if (request.url.match(/\/api\/users\/\w+/)) {
      if (request.method === "GET") {
        handlerGetUserById(request, response);
      }
      if (request.method === "DELETE") {
        handlerDeleteUserById(request, response);
      }
      if (request.method === "PUT") {
        handlerUpdateUserById(request, response);
      }
    } else {
      handlerPathBad(response);
    }
  }
}
