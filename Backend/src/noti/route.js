/*
 * @description
 * @since         Monday, 8 21st 2023, 21:50:21 pm
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */

const route = require("express").Router();
const controller = require("./controller");
const { checkAuth } = require("../../helper/verify");

route.get("/", checkAuth, controller.getNotifications);
route.get("/:id", checkAuth, controller.getNotification);
// route.post("/", checkAuth, controller.postNotification);
// route.put("/:id", checkAuth, controller.putNotification);
route.delete("/:id", checkAuth, controller.deleteNotification);
route.put("/:id/read", checkAuth, controller.readNotification);
route.put("/read_all", checkAuth, controller.readAllNotification);

module.exports = route;
