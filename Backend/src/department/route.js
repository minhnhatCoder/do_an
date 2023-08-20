/*
 * @description
 * @since         Monday, 7 24th 2023, 20:43:26 pm
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */

const route = require("express").Router();
const controller = require("./controller");
const { checkAuth } = require("../../helper/verify");

///////Phòng ban///////////
route.get("/depts", checkAuth, controller.getDept);
route.get("/depts/:id", checkAuth, controller.getDeptById);
route.post("/depts/", checkAuth, controller.createDept);
route.put("/depts/:id", checkAuth, controller.updateDept);
route.delete("/depts/:id", controller.deleteDept);
////////vị trí/////////////
route.get("/positions", checkAuth, controller.getPosition);
route.get("/positions/:id", checkAuth, controller.getPositionById);
route.post("/positions/", checkAuth, controller.createPosition);
route.put("/positions/:id", checkAuth, controller.updatePosition);
route.delete("/positions/:id", checkAuth, controller.deletePosition);

module.exports = route;
