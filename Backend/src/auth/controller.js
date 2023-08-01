const usersDB = require("./model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const { registerValidation, loginValidation, passwordValidation } = require("../../helper/validate");

exports.register = async (req, res) => {
  if (_.isEmpty(req.body)) {
    return res.status(400).json({
      status: 400,
      message: "Content can not be empty",
    });
  } else {
    //check email
    const emailExist = await usersDB.findOne({ email: req.body.email });
    if (emailExist)
      return res.status(400).send({
        status: 400,
        message: "Email đã tồn tại trên hệ thống",
      });
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    //create new user
    const user = new usersDB({
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role,
      department: req.body.department,
      position: req.body.position,
      display_name: req.body.display_name,
      gender: req.body.gender,
      image: req.body.image,
      address: req.body.address,
      phone: req.body.phone,
    });
    try {
      const saveUser = await user.save();
      return res.status(201).json({ status: 201, message: "Đăng ký thành công", data: saveUser });
    } catch (error) {
      return res.status(400).json({ status: 400, message: error.message });
    }
  }
};

exports.login = async (req, res) => {
  if (_.isEmpty(req.body)) {
    return res.status(400).json({
      status: 400,
      message: "Nội dung không được để trống",
    });
  } else {
    //validate the data
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).json({ status: 400, message: error.details[0].message });

    const user = await usersDB.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({
        status: 400,
        message: "tài khoản không tồn tại trên hệ thống",
      });
    }
    //check password
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).json({ status: 400, message: "Mật khẩu không đúng" });

    const { _id, ...rest } = user;

    //create token
    const token = jwt.sign({ _id }, process.env.TOKEN_SECRET, {
      expiresIn: "1d",
    });
    return res.status(200).json({
      status: 200,
      message: "Đăng nhập thành công",
      token,
    });
  }
};

exports.logout = (req, res) => {
  return res.status(200).json({ status: 200, message: "Đăng xuất thành công" });
};
