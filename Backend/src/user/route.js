const route = require("express").Router();
const controller = require("./controller");
const {
  checkRole,
  checkAuth
} = require("../../helper/verify");

route.get("/users", checkAuth, controller.getUsers);
route.get("/users/:id", checkAuth, controller.getUser);
route.put("/users/:id", checkAuth, controller.updateUser);
route.delete("/users/:id", checkRole, controller.deleteUser);

module.exports = route;