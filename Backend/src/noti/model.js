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
const { getUser, users } = require("../../untils/users")
const { handleSocket } = require("../../untils/socketHandler");

const io = handleSocket();

// Định nghĩa schema thông báo
const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users", // Tham chiếu đến mô hình User nếu cần
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  related_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  content: {
    type: String,
  },
  is_read: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Number,
    default: dayjs(new Date()).unix(),
  },
});


// // bắn thông báo cho user
// notificationSchema.post('save', async function (doc) {
//   // Lấy thông báo sau khi đã lưu
//   const notification = await Notification.findById(doc._id).populate('recipient');

//   // Bắn socket thông báo cho người nhận
//   if (notification.recipient) {
//     const socketId = getUser(notification.recipient._id.toString())?.socketId
//     io.to(socketId).emit('getNotification', notification);
//   }
// });


// Tạo mô hình thông báo từ schema
const Notification = mongoose.model("notification", notificationSchema);

module.exports = { notificationSchema }
module.exports = Notification;
