/*
 * @description
 * @since         Monday, 8 21st 2023, 21:50:57 pm
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */

const mongoose = require("mongoose");
const dayjs = require("dayjs");
const autopopulate = require("mongoose-autopopulate");
const usersDB = require("../auth/model");
const NotificationDB = require("../noti/model");

const friendRequestSchema = new mongoose.Schema({
  status: { type: String, required: true, default: "pending" },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  created_at: {
    type: Number,
    default: dayjs(new Date()).unix(),
  },
});
friendRequestSchema.plugin(autopopulate);
// Middleware để xóa tham chiếu tại bảng A khi xóa bản ghi trong bảng B
friendRequestSchema.pre("remove", async function (next) {
  const id = this._id;

  // Tìm tất cả các bản ghi trong bảng A có tham chiếu đến bId và xóa chúng
  await usersDB.findOneAndUpdate({ _id: this.receiver }, { $pull: { friend_requests: id } });
  await usersDB.findOneAndUpdate({ _id: this.sender }, { $pull: { friend_requests: id } });

  next();
});

friendRequestSchema.post("save", async function (doc) {
  const user = await usersDB.findById(doc.receiver);
  const notification = new NotificationDB({
    recipient: doc.receiver,
    content: `${user?.display_name} vừa gửi cho bạn lời mời kết bạn`,
    type: "friend_request",
    related_id: user?._id,
    created_at: dayjs(new Date()).unix(),
  });

  await notification.save();
});

friendRequestSchema.post("save", async function (doc) {
  const sender = await usersDB.findById(doc.sender);
  const notification = new NotificationDB({
    recipient: doc.receiver,
    content: `${sender?.display_name} đã gửi cho bạn lời mời kết bạn`,
    type: "friend_request",
    related_id: doc.sender,
    created_at: dayjs(new Date()).unix(),
  });

  await notification.save();
});

friendRequestSchema.post("findOneAndUpdate", async function (doc) {
  const receiver = await usersDB.findById(doc.receiver);
  const status = doc?.status == "approved" ? "chấp nhận" : "từ chối";
  const notification = new NotificationDB({
    recipient: doc.sender,
    content: `${receiver?.display_name} đã ${status} lời mời kết bạn`,
    type: "friend_request",
    related_id: doc.receiver,
    created_at: dayjs(new Date()).unix(),
  });

  await notification.save();
});

const friendRequestsDB = mongoose.model("friend_request", friendRequestSchema);
module.exports = { friendRequestsDB };
