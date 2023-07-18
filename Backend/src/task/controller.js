const taskDB = require("./model");
const Features = require("../../libs/feature");

exports.create = async (req, res) => {
  try {
    const task = new taskDB({
      title: req.body.title,
      description: req.body.description,
      attachments: req.body.attachments,
      related_user: req.body.related_user,
      assignor: req.body.assignor,
      reciever: req.body.reciever,
    });
    const saveTask = await task.save();
    return res.status(200).json({
      status: 200,
      message: "Tạo công việc thành công",
      data: saveTask,
    });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};
exports.getTask = async (req, res) => {
  try {
    const features = new Features(
      taskDB.find().populate("reciever", ["first_name", "last_name", "image"]),
      req.query
    )
      .sorting()
      .paginating()
      .searching()
      .filtering();

    const counting = new Features(taskDB.find(), req.query)
      .sorting()
      .searching()
      .filtering()
      .counting();
    const result = await Promise.allSettled([
      features.query,
      counting.query, //count number of user.
    ]);

    const task = result[0].status === "fulfilled" ? result[0].value : [];
    const count = result[1].status === "fulfilled" ? result[1].value : 0;

    return res.status(200).json({
      status: 200,
      data: task,
      count: count,
    });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};
exports.getTaskById = async (req, res) => {
  try {
    const data = await taskDB.findById(req.params.id);
    return res.status(200).json({ status: 200, data });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};
exports.update = async (req, res) => {
  try {
    const data = await taskDB.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res
      .status(200)
      .json({ status: 200, message: "Cập nhật thành công", data });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};
exports.deleteTask = async (req, res) => {
  try {
    await taskDB.findByIdAndDelete(req.params.id);
    return res.status(200).json({ status: 200, message: "Xóa thành công" });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};
