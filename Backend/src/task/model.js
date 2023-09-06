const mongoose = require("mongoose");
const dayjs = require("dayjs");
const usersDB = require("../auth/model");
const NotificationDB = require("../noti/model");

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
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "comments" }],
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

taskSchema.post("save", async function (doc) {
  const creator = await usersDB.findById(doc?.assigner);

  // Danh sách các người nhận (ví dụ)
  const recipients = doc?.related_user.filter((u) => !u.equals(doc?.assigner)); // Thay thế bằng danh sách người nhận thực tế

  // Tạo thông báo cho mỗi người nhận
  for (const recipientId of recipients) {
    const notification = new NotificationDB({
      recipient: recipientId,
      content: `${creator?.display_name} đã tạo công việc`,
      type: "task",
      related_id: doc._id,
      created_at: dayjs(new Date()).unix(),
    });

    await notification.save();
  }
});


const tasksDB = mongoose.model("tasks", taskSchema);
const projectsDB = mongoose.model("projects", projectSchema);

module.exports = { tasksDB, projectsDB };
