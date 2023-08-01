const mongoose = require("mongoose");
const usersDB = require("../auth/model");

// Định nghĩa schema cho chức vụ
const positionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    require: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  number_user: {
    type: Number,
    require: true,
    default: 1,
  },
});

positionSchema.pre("save", async function (next) {
  try {
    const departmentId = this.department;
    const existingPositions = await mongoose.models.Position.find({
      department: departmentId,
      level: this.level,
    }).populate("department");

    if (this.level === 1 && existingPositions.length > 0) {
      throw new Error("Chỉ được tạo 1 chức vụ level 1 trong phòng ban " + existingPositions[0]?.department?.name);
    } else if (this.level === 2 && existingPositions.length > 1) {
      throw new Error("Chỉ được tạo 2 chức vụ level 2 trong phòng ban " + existingPositions[0]?.department?.name);
    }
    next();
  } catch (err) {
    next(err);
  }
});

positionSchema.pre("findByIdAndUpdate", async function (next) {
  try {
    const update = this.getUpdate();
    const departmentId = update.department || this._update.$set.department;

    const existingPositions = await mongoose.models.Position.find({
      department: departmentId,
      level: update.level || this._update.$set.level,
    }).populate("department");

    if (update.level === 1 && existingPositions.length > 0) {
      throw new Error("Chỉ được tạo 1 chức vụ level 1 trong phòng ban " + existingPositions[0]?.department?.name);
    } else if (update.level === 2 && existingPositions.length > 1) {
      throw new Error("Chỉ được tạo 2 chức vụ level 2 trong phòng ban " + existingPositions[0]?.department?.name);
    }

    next();
  } catch (err) {
    next(err);
  }
});

positionSchema.pre("remove", async function (next) {
  try {
    const employeesCount = await usersDB.countDocuments({ position: this._id });

    if (employeesCount > 0) {
      throw new Error("Không thể xóa vị trí này vì có nhân viên đang giữ vị trí này.");
    }

    next();
  } catch (err) {
    next(err);
  }
});

// Định nghĩa schema cho phòng ban
const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  positions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Position", // Tham chiếu tới collection 'positions'
    },
  ],
});

// Tạo model từ schema
const Department = mongoose.model("Department", departmentSchema);
const Position = mongoose.model("Position", positionSchema);

module.exports = { Department, Position };
