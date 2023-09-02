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

// Tạo mô hình thông báo từ schema
const Notification = mongoose.model("notification", notificationSchema);

module.exports = Notification;
