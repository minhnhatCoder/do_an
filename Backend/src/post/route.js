const route = require("express").Router();
const controller = require("./controller");
const { checkAuth } = require("../../helper/verify");

route.get("/posts", controller.getPost);
route.get("/posts/:id", controller.getPostById);
route.post("/posts/", controller.create);
route.put("/posts/:id", controller.update);
route.delete("/posts/:id", controller.deletePostById);
route.put("/like/:id", checkAuth, controller.likePost);
route.put("/comment/:id", checkAuth, controller.commentPost);
route.put(
  "/comment/:id/answer",
  checkAuth,
  controller.answerCommentPost
);

module.exports = route;
