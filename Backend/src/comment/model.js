/*
 * @description
 * @since         Thursday, 8 10th 2023, 20:54:08 pm
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */

const mongoose = require("mongoose");
const dayjs = require("dayjs");

const commentSchema = new mongoose.Schema({
  target: { type: mongoose.Schema.Types.ObjectId },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  content: {
    type: String,
    default: "",
    require: true,
  },
  attachments: {
    type: Array,
    default: [],
  },
  created_at: {
    type: Number,
    default: dayjs(new Date()).unix(),
  },
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "comments" }],
});

const commentsDB = mongoose.model("comments", commentSchema);

module.exports = { commentsDB };
