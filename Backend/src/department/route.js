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
route.get("/depts", controller.getDept);
route.get("/depts/:id", controller.getDeptById);
route.post("/depts/", controller.createDept);
route.put("/depts/:id", controller.updateDept);
route.delete("/depts/:id", controller.deleteDept);
////////vị trí/////////////
route.get("/positions", controller.getPosition);
route.get("/positions/:id", controller.getPositionById);
route.post("/positions/", controller.createPosition);
route.put("/positions/:id", controller.updatePosition);
route.delete("/positions/:id", controller.deletePosition);

module.exports = route;
