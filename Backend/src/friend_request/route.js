/*
 * @description    
 * @since         Monday, 8 21st 2023, 21:50:50 pm
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */

const route = require("express").Router();
const controller = require("./controller");
const { checkAuth } = require("../../helper/verify");

route.get("/", checkAuth, controller.getFriendRequests);
route.get("/:id", checkAuth, controller.getFriendRequest);
route.post("/", checkAuth, controller.postFriendRequest);
route.put("/:id", checkAuth, controller.putFriendRequest);
route.put("/remove_friend/:id", checkAuth, controller.putRemoveFriend);
route.delete("/:id", checkAuth, controller.deleteFriendRequest);



module.exports = route;
