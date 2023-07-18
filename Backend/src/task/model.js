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
  created_at: {
    type: Number,
    default: dayjs(new Date()).unix(),
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
  assignor: {
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
const tasksDB = mongoose.model("tasks", taskSchema);

module.exports = tasksDB;
