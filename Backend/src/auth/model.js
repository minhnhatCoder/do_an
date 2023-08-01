const mongoose = require("mongoose");
const dayjs = require("dayjs");
const { Position } = require("../department/model");

const userSchema = new mongoose.Schema({
  display_name: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },
  password: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },
  phone: {
    type: String,
    default: "",
  },
  image: {
    type: Object,
  },
  gender: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  status: {
    type: Number,
    default: 1,
  },
  birth: {
    type: Number,
  },
  role: {
    type: Number,
    required: true,
    default: 1,
  },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
  position: { type: mongoose.Schema.Types.ObjectId, ref: "Position", required: true },
  employee_id: {
    type: String,
    unique: true,
  },
});

userSchema.pre("save", async function (next) {
  try {
    const position = await Position.findById(this.position);

    if (!position) {
      throw new Error("Không tìm thấy chức vụ tương ứng cho nhân viên.");
    }

    const employeesCount = await usersDB.countDocuments({ position: this.position });

    if (employeesCount >= position.number_user) {
      throw new Error("Chức vụ đã đủ người, không thể tạo thêm nhân viên.");
    }

    next();
  } catch (err) {
    next(err);
  }
});

userSchema.pre("save", async function (next) {
  try {
    const lastEmployee = await usersDB.findOne({}, { employee_id: 1 }, { sort: { employee_id: -1 } });
    if (lastEmployee) {
      const lastEmployeeId = parseInt(lastEmployee.employee_id.substring(2), 10);
      const newEmployeeId = lastEmployeeId + 1;
      this.employee_id = `NV${String(newEmployeeId).padStart(2, "0")}`;
    } else {
      this.employee_id = "NV01";
    }
    next();
  } catch (err) {
    console.error("Lỗi khi tạo mã nhân viên:", err);
    next(err);
  }
});

const usersDB = mongoose.model("users", userSchema);

module.exports = usersDB;
