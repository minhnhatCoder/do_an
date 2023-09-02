/*
 * @description
 * @since         Monday, 8 21st 2023, 21:51:09 pm
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */
const NotificationDB = require("./model");
const Features = require("../../libs/feature");
const dayjs = require("dayjs");
exports.getNotifications = async (req, res) => {
  try {
    const features = new Features(NotificationDB.find(), req.query)
      .sorting()
      .paginating()
      .searching("title")
      .filtering();

    const counting = new Features(NotificationDB.find(), req.query).sorting().searching("title").filtering().counting();
    const result = await Promise.allSettled([
      features.query,
      counting.query, //count number of user.
    ]);

    const notifications = result[0].status === "fulfilled" ? result[0].value : [];
    const count = result[1].status === "fulfilled" ? result[1].value : 0;

    return res.status(200).json({
      status: 200,
      data: notifications,
      count: count,
    });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};
exports.getNotification = async (req, res) => {
  try {
    const notification = await NotificationDB.findOne({ _id: req.params.id });
    return res.status(200).json({
      status: 200,
      data: notification,
    });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};
exports.deleteNotification = async (req, res) => {
  try {
    await NotificationDB.deleteOne({ _id: req.params.id });
    return res.status(200).json({
      status: 200,
      message: "Xóa thông báo thành công",
    });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};

exports.readNotification = async (req, res) => {
  try {
    await NotificationDB.findByIdAndUpdate(req.params.id, {
      is_read: true,
    });
    return res.status(200).json({
      status: 200,
      message: "Đọc thông báo thành công",
    });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};

exports.readAllNotification = async (req, res) => {
  try {
    await NotificationDB.updateMany(
      {
        recipient: req.user_data?._id,
      },
      {
        is_read: true,
      }
    );
    return res.status(200).json({
      status: 200,
      message: "Đọc tất cả thông báo thành công",
    });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};
