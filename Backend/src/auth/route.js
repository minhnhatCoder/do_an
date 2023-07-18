const route = require("express").Router();
// const { checkAuth } = require("../../controller/auth-controller/verify");
const controller = require("./controller");

route.post("/register", controller.register);
route.post("/login", controller.login);
route.post("/logout", controller.logout);

module.exports = route;