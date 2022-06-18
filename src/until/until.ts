import { v4 as uuid } from "uuid";
import { IUser, IUserBody } from "../data/user.interface";
import { users } from "../data/users";

export const createUser = (user: IUserBody) => {
  return users.push({ id: uuid(), ...user });
};

export const getUser = (userId: string) => {
  return users.filter((user) => user.id === userId)[0];
};

export const deleteUser = (userId: string) => {
  return users.filter((user) => user.id !== userId);
};

export const updateUser = (userId: string, user: IUser) => {
  const oldUser = getUser(userId);
  const id = users.indexOf(oldUser);
  users[id] = { ...user };
};
