import { v4 as uuid, validate as uuidValidate } from "uuid";
import { IUserBody } from "../data/user.interface";
import users from "../data/users";

export const getId = (path: string) => {
  let mas = path.split("/");
  return mas[mas.length - 1];
};

export const isValidId = (id: string) => {
  return uuidValidate(id);
};

export const createUser = (user: IUserBody) => {
  let newUser = { id: uuid(), ...user };
  users.push(newUser);
  return getUser(newUser.id);
};

export const getUser = (userId: string) => {
  return users.filter((user) => user.id === userId)[0];
};

export const deleteUser = (userId: string) => {
  const id = users.findIndex((user) => user.id === userId);
  return users.splice(id, 1);
};

export const updateUser = (userId: string, user: IUserBody) => {
  const id = users.findIndex((user) => user.id === userId);
  users[id] = { id: userId, ...user };
  return getUser(userId);
};
