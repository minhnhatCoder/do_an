/*
 * @description    
 * @since         Sunday, 8 20th 2023, 9:50:56 am
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */


const route = require("express").Router();
const controller = require("./controller");
const { checkAuth } = require("../../helper/verify");

route.get("/", checkAuth, controller.getConversations);
route.get("/:id", checkAuth, controller.getConversation);
route.post("/", checkAuth, controller.postConversation);
route.put("/:id", checkAuth, controller.putConversation);
route.delete("/:id", checkAuth, controller.deleteConversation);

route.post("/:id/message", checkAuth, controller.postConversation);

module.exports = route;
