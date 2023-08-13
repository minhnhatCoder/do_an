const mongoose = require("mongoose");
const dayjs = require("dayjs");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "",
  },
  content: {
    type: String,
    require: true,
  },
  update_at: {
    type: Number,
  },
  created_at: {
    type: Number,
    default: dayjs(new Date()).unix(),
  },
  show_type: { type: Number, default: 0 },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "comments" }],
  related_user: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  liked_user: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  attachments: {
    type: Array,
    default: [],
  },
  created_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    require: true,
  },
});
const postsDB = mongoose.model("post", postSchema);

module.exports = postsDB;
