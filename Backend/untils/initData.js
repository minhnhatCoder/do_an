const mongoose = require("mongoose");
const User = require("../src/auth/model");
const { Department, Position } = require("../src/department/model");
require("dotenv").config({ path: ".env" });
const bcrypt = require("bcryptjs");
mongoose.set("strictQuery", true);
// Kết nối tới MongoDB
mongoose
  .connect(
    "mongodb+srv://tuedoduc1111:F5K0eHt90PupwKMZ@tuedoduc.1t4d6.mongodb.net/",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(async () => {
    console.log("Connected to MongoDB");

    // 1. Tạo Phòng Ban (Department)
    const department = await Department.create({
      name: "Ban giám đốc",
    });

    // 2. Tạo Vị Trí (Position) trong Phòng Ban đã tạo
    const position = await Position.create({
      name: "Giám đốc",
      level: 1,
      department: department._id,
      number_user: 1,
    });

    // Tạo mật khẩu mặc định
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin@123", salt);

    // 3. Tạo Người Dùng Admin
    const user = await User.create({
      display_name: "Đỗ Đức Tuệ",
      email: "admin@gmail.com",
      role: 1,
      position: position._id, // Liên kết với vị trí
      department: department._id, // Liên kết với phòng ban
      password: hashedPassword,
    });
    console.log("Admin User created:", user.display_name);

    mongoose.connection.close(); // Đóng kết nối sau khi tạo xong dữ liệu
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
