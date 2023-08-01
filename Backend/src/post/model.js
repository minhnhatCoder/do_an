const mongoose = require("mongoose");
const dayjs = require("dayjs");

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    require: true,
  },
  created_at: {
    type: Number,
    default: dayjs(new Date()).unix(),
  },
  comments: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId,
      },
      created_by: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
      content: String,
      image: String,
      answer_comment: [
        {
          _id: {
            type: mongoose.Schema.Types.ObjectId,
            default: mongoose.Types.ObjectId,
          },
          user_id: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
          content: String,
          image: String,
          created_at: {
            type: Number,
            default: dayjs(new Date()).unix(),
          },
        },
      ],
      created_at: {
        type: Number,
        default: dayjs(new Date()).unix(),
      },
    },
  ],
  like_count: {
    type: Number,
    default: 0,
  },
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
