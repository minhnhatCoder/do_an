const route = require("express").Router();
const controller = require("./controller");

route.get("/tasks", controller.getTask);
route.get("/tasks/:id", controller.getTaskById);
route.post("/tasks", controller.create);
route.put("/tasks/:id", controller.update);
route.delete("/tasks/:id", controller.deleteTask);

module.exports = route;
