import HttpService from "../services/HttpService";

const login = (email, password) =>
  HttpService.login("auth/login", {
    email,
    password,
  });

const register = (firstName, lastName, email, password, type) =>
  HttpService.create("auth/register", {
    firstName,
    lastName,
    email,
    password,
    type,
  });
export default {
  login,
  register,
};
