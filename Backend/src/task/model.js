const mongoose = require("mongoose");
const dayjs = require("dayjs");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "",
    require: true,
  },
  description: {
    type: String,
    default: "",
  },
  priority: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Number,
    default: dayjs(new Date()).unix(),
  },
  start_date: {
    type: Number,
    required: true,
  },
  end_date: {
    type: Number,
    required: true,
  },
  comments: {
    type: Array,
    default: [],
  },
  status: {
    type: Number,
    default: 1,
  },
  progress: {
    type: Number,
    default: 0,
  },
  related_user: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "projects",
    required: true,
  },
  parent_task: { type: mongoose.Schema.Types.ObjectId, ref: "tasks" },
  assigner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    require: true,
  },
  reciever: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    require: true,
  },
  attachments: {
    type: Array,
    default: [],
  },
});

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "",
    require: true,
  },
  assigner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    require: true,
  },
  created_at: {
    type: Number,
    default: dayjs(new Date()).unix(),
  },
  related_user: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
});

// Middleware kiểm tra trước khi lưu (pre-save middleware)
taskSchema.pre("save", async function (next) {
  // Kiểm tra nếu assigner._id không có trong mảng related_user thì thêm vào
  if (!this.related_user.includes(this.assigner)) {
    this.related_user.push(this.assigner);
  }

  // Kiểm tra nếu reciever._id không có trong mảng related_user thì thêm vào
  if (!this.related_user.includes(this.reciever)) {
    this.related_user.push(this.reciever);
  }

  next();
});
const tasksDB = mongoose.model("tasks", taskSchema);
const projectsDB = mongoose.model("projects", projectSchema);

module.exports = { tasksDB, projectsDB };
