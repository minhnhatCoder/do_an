/*
 * @description
 * @since         Thursday, 8 10th 2023, 20:53:57 pm
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */

const { commentsDB } = require("./model");
const Features = require("../../libs/feature");
const dayjs = require("dayjs");

exports.getComments = async (req, res) => {
  try {
    const features = new Features(
      commentsDB.find().populate("answers").populate("created_by", ["display_name", "image"]),
      req.query
    )
      .sorting()
      .paginating()
      .searching("content")
      .filtering();

    const counting = new Features(commentsDB.find(), req.query).sorting().searching("content").filtering().counting();
    const result = await Promise.allSettled([
      features.query,
      counting.query, //count number of user.
    ]);

    const comments = result[0].status === "fulfilled" ? result[0].value : [];
    const count = result[1].status === "fulfilled" ? result[1].value : 0;

    return res.status(200).json({
      status: 200,
      data: comments,
      count: count,
    });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};
exports.getComment = async (req, res) => {};
exports.postComment = async (req, res) => {};
exports.putComment = async (req, res) => {};
exports.deleteComment = async (req, res) => {};
