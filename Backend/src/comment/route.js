/*
 * @description
 * @since         Thursday, 8 10th 2023, 20:53:24 pm
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */
const route = require("express").Router();
const controller = require("./controller");
const { checkAuth } = require("../../helper/verify");

route.get("/", controller.getComments);
// route.get("/:id", controller.getComment);
// route.post("/", checkAuth, controller.postComment);
// route.put("/:id", controller.putComment);
// route.delete("/:id", controller.deleteComment);

module.exports = route;
