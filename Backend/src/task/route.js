const route = require("express").Router();
const controller = require("./controller");
const { checkAuth } = require("../../helper/verify");

route.get("/tasks", checkAuth, controller.getTask);
route.get("/tasks/:id", checkAuth, controller.getTaskById);
route.post("/tasks", checkAuth, controller.createTask);
route.post("/tasks/comment/:id", checkAuth, controller.commentTask);
route.put("/tasks/:id", checkAuth, controller.updateTask);
route.delete("/tasks/:id", checkAuth, controller.deleteTask);

route.get("/projects", checkAuth, controller.getProjects);
route.get("/projects/:id", checkAuth, controller.getProject);
route.post("/projects", checkAuth, controller.createProject);
route.put("/projects/:id", checkAuth, controller.updateProject);
route.delete("/projects/:id", checkAuth, controller.deleteProject);

module.exports = route;
