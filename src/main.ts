import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { PORT } from "./common/config";
import { IUserBody } from "./data/user.interface";
import users from "./data/users";
import { handlereqres } from "./handlereq";
import {
  createUser,
  deleteUser,
  getId,
  getUser,
  isValidId,
  updateUser,
} from "./util/util";

const server = createServer(handlereqres);

server.listen(PORT, () =>
  process.stdout.write(`Server is running on http://localhost:${PORT}\n`)
);
