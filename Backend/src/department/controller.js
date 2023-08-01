/*
 * @description
 * @since         Monday, 7 24th 2023, 20:43:19 pm
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */

const { Department, Position } = require("./model");
const Features = require("../../libs/feature");

exports.getDept = async (req, res) => {
  try {
    const features = new Features(Department.find().populate("positions"), req.query)
      .sorting()
      .paginating()
      .searching()
      .filtering();

    const counting = new Features(Department.find(), req.query).sorting().searching().filtering().counting();
    const result = await Promise.allSettled([
      features.query,
      counting.query, //count number of user.
    ]);

    const post = result[0].status === "fulfilled" ? result[0].value : [];
    const count = result[1].status === "fulfilled" ? result[1].value : 0;

    return res.status(200).json({
      status: 200,
      data: post,
      count: count,
    });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};
exports.getDeptById = async (req, res) => {
  try {
    const data = await Department.findById(req.params.id);
    return res.status(200).json({ status: 200, data });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};
exports.createDept = async (req, res) => {
  try {
    const dept = new Department({
      name: req.body.name,
    });
    const saveDept = await dept.save();
    return res.status(200).json({
      status: 200,
      message: "Tạo phòng ban thành công",
      data: saveDept,
    });
  } catch (error) {
    return res.status(400).json({ status: 400, message: "Tạo phòng ban thất bại" });
  }
};
exports.updateDept = async (req, res) => {
  try {
    const data = await Department.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json({ status: 200, message: "Cập nhật thành công", data });
  } catch (error) {
    return res.status(400).json({ status: 400, message: "Cập nhật thất bại" });
  }
};
exports.deleteDept = async (req, res) => {
  try {
    await Department.findByIdAndUpdate(req.params.id);
    return res.status(200).json({ status: 200, message: "Xóa thành công" });
  } catch (error) {
    return res.status(400).json({ status: 400, message: "Xóa thất bại" });
  }
};

/////////////////////////////////////

exports.getPosition = async (req, res) => {
  try {
    const features = new Features(Position.find().populate("department"), req.query)
      .sorting()
      .paginating()
      .searching()
      .filtering();

    const counting = new Features(Position.find(), req.query).sorting().searching().filtering().counting();
    const result = await Promise.allSettled([
      features.query,
      counting.query, //count number of user.
    ]);

    const post = result[0].status === "fulfilled" ? result[0].value : [];
    const count = result[1].status === "fulfilled" ? result[1].value : 0;

    return res.status(200).json({
      status: 200,
      data: post,
      count: count,
    });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};
exports.getPositionById = async (req, res) => {
  try {
    const data = await Position.findById(req.params.id);
    return res.status(200).json({ status: 200, data });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};
exports.createPosition = async (req, res) => {
  try {
    const position = new Position({
      name: req.body.name,
      level: req.body.level,
      department: req.body.department,
      number_user: req.body.number_user,
    });
    const savePosition = await position.save();
    await Department.findByIdAndUpdate(req.body.department, {
      $push: { positions: savePosition?._id },
    });
    return res.status(200).json({
      status: 200,
      message: "Tạo vị trí thành công",
      data: savePosition,
    });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
    // return res.status(400).json({ status: 400, message: "Tạo vị trí thất bại" });
  }
};
exports.updatePosition = async (req, res) => {
  try {
    const data = await Position.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json({ status: 200, message: "Cập nhật thành công", data });
  } catch (error) {
    return res.status(400).json({ status: 400, message: "Cập nhật thất bại" });
  }
};
exports.deletePosition = async (req, res) => {
  try {
    await Position.findByIdAndUpdate(req.params.id);
    return res.status(200).json({ status: 200, message: "Xóa thành công" });
  } catch (error) {
    return res.status(400).json({ status: 400, message: "Xóa thất bại" });
  }
};
