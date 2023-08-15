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

postSchema.pre("save", async function (next) {
  // Kiểm tra nếu assigner._id không có trong mảng related_user thì thêm vào
  if (!this.related_user.includes(this.created_user)) {
    this.related_user.push(this.created_user);
  }

  next();
});

const postsDB = mongoose.model("post", postSchema);
// Middleware kiểm tra trước khi lưu (pre-save middleware)


module.exports = postsDB;
