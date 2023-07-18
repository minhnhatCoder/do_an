const route = require("express").Router();
// const { checkAuth } = require("../../controller/auth-controller/verify");
const controller = require("./controller");
const {
    checkRole,
  } = require("../../helper/verify");

route.get("/users", controller.getUsers);
route.get("/users/:id", controller.getUser);
route.put("/users/:id", controller.updateUser);
route.delete("/users/:id", checkRole, controller.deleteUser);

module.exports = route;