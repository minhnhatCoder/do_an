const mongoose = require("mongoose");
const dayjs = require("dayjs");
const usersDB = require("../auth/model");
const NotificationDB = require("../noti/model");

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
  like_noti: { type: mongoose.Schema.Types.ObjectId, default: mongoose.Types.ObjectId() },
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

postSchema.post("save", async function (doc) {
  try {
    const creator = await usersDB.findById(doc?.created_user);
    const creatorLikeNotification = new NotificationDB({
      _id: doc.like_noti,
      recipient: doc?.created_user,
      content: ``,
      type: "post",
      related_id: doc._id,
      is_read: true,
      created_at: dayjs(new Date()).unix(),
    });
    await creatorLikeNotification.save();

    // Danh sách các người nhận (ví dụ)
    const recipients = doc?.related_user.filter((u) => !u.equals(doc?.created_user)); // Thay thế bằng danh sách người nhận thực tế

    // Tạo thông báo cho mỗi người nhận
    for (const recipientId of recipients) {
      const notification = new NotificationDB({
        recipient: recipientId,
        content: `${creator?.display_name} đã tạo bài viết mới`,
        type: "post",
        related_id: doc._id,
        created_at: dayjs(new Date()).unix(),
      });
      await notification.save();
    }
  } catch (error) {
    console.log(error);
  }

});

const postsDB = mongoose.model("post", postSchema);

module.exports = postsDB;
