const route = require("express").Router();
const controller = require("./controller");
const { checkAuth } = require("../../helper/verify");

route.get("/tasks", controller.getTask);
route.get("/tasks/:id", controller.getTaskById);
route.post("/tasks", checkAuth, controller.createTask);
route.put("/tasks/:id", controller.updateTask);
route.delete("/tasks/:id", controller.deleteTask);

route.get("/projects", controller.getProjects);
route.get("/projects/:id", controller.getProject);
route.post("/projects", checkAuth, controller.createProject);
route.put("/projects/:id", controller.updateProject);
route.delete("/projects/:id", controller.deleteProject);

module.exports = route;
