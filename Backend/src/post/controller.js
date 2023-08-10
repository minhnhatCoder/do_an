const postsDB = require("./model");
const Features = require("../../libs/feature");
const mongoose = require("mongoose");
const dayjs = require("dayjs");

exports.create = async (req, res) => {
  try {
    const post = new postsDB({
      content: req.body.content,
      created_user: req.body.created_user,
      attachments: req.body.attachments,
      related_user: req.body.related_user,
      created_at: dayjs(new Date()).unix(),
    });
    const savePost = await post.save();
    return res.status(200).json({
      status: 200,
      message: "Đăng bài thành công",
      data: savePost,
    });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};
exports.getPost = async (req, res) => {
  try {
    const features = new Features(
      postsDB
        .find()
        .populate("created_user", ["first_name", "last_name", "image"])
        .populate("comments.user_id", ["first_name", "last_name", "image"]),
      req.query
    )
      .sorting()
      .paginating()
      .searching()
      .filtering();

    const counting = new Features(postsDB.find().populate("created_user"), req.query)
      .sorting()
      .searching()
      .filtering()
      .counting();
    const result = await Promise.allSettled([
      features.query,
      counting.query, //count number of user.
    ]);

    const post = result[0].status === "fulfilled" ? result[0].value : [];
    const count = result[1].status === "fulfilled" ? result[1].value : 0;

    return res.status(200).json({
      status: 200,
      data: post,
      count: count,
    });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};
exports.getPostById = async (req, res) => {
  try {
    const data = await postsDB.findById(req.params.id);
    return res.status(200).json({ status: 200, data });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};
exports.update = async (req, res) => {
  try {
    const data = await postsDB.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json({ status: 200, message: "Cập nhật thành công", data });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};
exports.deletePostById = async (req, res) => {
  try {
    await postsDB.findByIdAndUpdate(req.params.id);
    return res.status(200).json({ status: 200, message: "Xóa thành công" });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await postsDB.findById(req.params.id);
    const existUserLiked = post.liked_user.find((item) => item == req.user_data._id);
    if (existUserLiked) {
      await postsDB.findByIdAndUpdate(req.params.id, {
        $pull: { liked_user: req.user_data._id },
      });
      return res.status(200).json({ status: 200, message: "Bỏ thích bài viết thành công" });
    } else {
      await postsDB.findByIdAndUpdate(req.params.id, {
        $push: { liked_user: req.user_data._id },
      });
      return res.status(200).json({ status: 200, message: "Thích bài viết thành công" });
    }
  } catch (error) {
    return res.status(400).json({ status: "400", message: error.message });
  }
};

exports.answerCommentPost = async (req, res) => {
  try {
    await postsDB.updateOne(
      { _id: req.params.id, "comments._id": req.params.ans_id },
      {
        $push: {
          "comments.$.answer_comment": {
            user_id: req.user_data._id,
            content: req.body.content,
            image: req.body.image,
          },
        },
      }
    );
    return res.status(200).json({ status: 200, message: "Trả lời comment bài viết thành công" });
  } catch (error) {
    return res.status(400).json({ status: "400", message: error.message });
  }
};
exports.commentPost = async (req, res) => {
  try {
    await postsDB.findByIdAndUpdate(req.params.id, {
      $push: {
        comments: {
          user_id: req.user_data._id,
          content: req.body.content,
          image: req.body.image,
        },
      },
    });
    return res.status(200).json({ status: 200, message: "Comment bài viết thành công" });
  } catch (error) {
    return res.status(400).json({ status: "400", message: error.message });
  }
};
