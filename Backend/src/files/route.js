const route = require("express").Router();
const controller = require("./controller");

route.post("/upload", controller.upload);

module.exports = route;
