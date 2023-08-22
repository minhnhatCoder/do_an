const usersDB = require("../auth/model");
const _ = require("lodash");
const Features = require("../../libs/feature");
const bcrypt = require("bcryptjs");
const { passwordValidation } = require("../../helper/validate");
const dayjs = require("dayjs");
const mongoose = require("mongoose");

exports.getUsers = async (req, res) => {
  try {
    const features = new Features(
      usersDB.find().populate("department", ["name"]).populate("position", ["name"]),
      req.query
    )
      .sorting()
      .paginating()
      .searching("display_name")
      .filtering();
    const counting = new Features(usersDB.find(), req.query).sorting().searching().filtering().counting();
    const result = await Promise.allSettled([
      features.query,
      counting.query, //count number of user.
    ]);

    const users = result[0].status === "fulfilled" ? result[0].value : [];
    const count = result[1].status === "fulfilled" ? result[1].value : 0;

    return res.status(200).json({
      status: 200,
      data: users.map((u) => {
        const { password, ...last } = u._doc;
        return {
          ...last,
        };
      }),
      count,
    });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: error.message,
    });
  }
};

exports.getUser = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({
      status: 400,
      message: "Có lỗi xảy ra",
    });
  }
  try {
    let query;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      // Nếu giá trị đầu vào là ObjectId hợp lệ, tìm theo cả _id và employee_id
      query = {
        $or: [{ _id: req.params.id }, { employee_id: req.params.id }],
      };
    } else {
      // Nếu giá trị đầu vào không phải là ObjectId, tìm theo employee_id (mã nhân viên)
      query = { employee_id: req.params.id };
    }
    const data = await usersDB.find(query).populate("department", ["name"]).populate("position", ["name"]).populate({
      path: 'friends',
      select: 'display_name image',
      populate: [
        { path: 'department', select: 'name' },
        { path: 'position', select: 'name' },
      ],
    }).populate({
      path: 'friend_requests', populate: [{
        path: "sender", select: "display_name image", populate: [
          { path: 'department', select: 'name' },
          { path: 'position', select: 'name' },
        ],
      }]
    })
   
    return res.status(200).json({
      status: 200,
      data: data[0],
    });
  } catch (error) {
    return res.status(200).json({
      status: 400,
      message: error.message,
    });
  }
};
exports.updateUser = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({
      status: 400,
      message: "Cần truyền lên id",
    });
  }

  let newBody;
  if (req.body.password) {
    //validate the password
    const { error } = passwordValidation({ password: req.body.password });
    if (error) return res.status(400).json({ status: 400, message: error.details[0].message, result: [] });
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    newBody = { ...req.body, password: hashedPassword };
  } else {
    newBody = { ...req.body };
  }

  //   if (req.body.birth) {
  //     newBody.birth = new Date(req.body.birth);
  //   }

  try {
    const data = await usersDB.findByIdAndUpdate(req.params.id, newBody, {
      useFindAndModify: false,
      new: true,
    });
    return res.status(200).json({
      status: 200,
      message: "Cập nhật thành công",
      data: data,
    });
  } catch (error) {
    return res.status(200).json({
      status: 400,
      message: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({
      status: 400,
      message: "Cần truyền lên id",
    });
  }
  try {
    await usersDB.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      status: 200,
      message: "Xóa thành công",
    });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: error.message,
    });
  }
};
