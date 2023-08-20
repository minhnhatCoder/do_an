const route = require("express").Router();
const controller = require("./controller");
const { checkAuth } = require("../../helper/verify");

route.get("/posts", checkAuth, controller.getPost);
route.get("/posts/:id", checkAuth, controller.getPostById);
route.post("/posts/", checkAuth, controller.create);
route.put("/posts/:id", checkAuth, controller.update);
route.delete("/posts/:id", checkAuth, controller.deletePostById);
route.put("/like/:id", checkAuth, controller.likePost);
route.put("/comment/:id", checkAuth, controller.commentPost);
route.put(
  "/comment/:id/answer",
  checkAuth,
  controller.answerCommentPost
);

module.exports = route;
