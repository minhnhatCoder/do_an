const { tasksDB, projectsDB } = require("./model");
const { commentsDB } = require("../comment/model");
const Features = require("../../libs/feature");
const dayjs = require("dayjs");

exports.createTask = async (req, res) => {
  try {
    const task = new tasksDB({
      title: req.body.title,
      description: req.body.description,
      attachments: req.body.attachments,
      related_user: req.body.related_user,
      project: req.body.project,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      assigner: req.user_data._id,
      reciever: req.body.reciever,
      priority: req.body.priority,
      parent_task: req.body.parent_task,
      created_at: dayjs(new Date()).unix(),
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
      tasksDB
        .find()
        .populate("reciever", ["display_name", "image"])
        .populate("project", ["title"])
        .populate("assigner", ["display_name", "image"])
        .populate("related_user", ["display_name", "image"]),
      req.query
    )
      .sorting()
      .paginating()
      .searching("title")
      .filtering();

    const counting = new Features(tasksDB.find(), req.query).sorting().searching("title").filtering().counting();
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
    const data = await tasksDB
      .findById(req.params.id)
      .populate("reciever", ["display_name", "image"])
      .populate("project", ["title"])
      .populate("assigner", ["display_name", "image"])
      .populate("related_user", ["display_name", "image"]);
    return res.status(200).json({ status: 200, data });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};
exports.updateTask = async (req, res) => {
  try {
    const data = await tasksDB.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json({ status: 200, message: "Cập nhật thành công", data });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};
exports.deleteTask = async (req, res) => {
  try {
    await tasksDB.findByIdAndDelete(req.params.id);
    return res.status(200).json({ status: 200, message: "Xóa thành công" });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};
exports.commentTask = async (req, res) => {
  try {
    const comment = new commentsDB({
      target: req.params.id,
      created_by: req.user_data._id,
      content: req.body.content,
      attachments: req.body.attachments,
      created_at: dayjs(new Date()).unix(),
    });
    const savedComment = await comment.save();
    await tasksDB.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          savedComment,
        },
      },
      {
        new: true,
      }
    );
    return res.status(200).json({ status: 200, message: "Bình luận thành công", data: savedComment });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};
exports.createProject = async (req, res) => {
  try {
    const project = new projectsDB({
      title: req.body.title,
      assigner: req.user_data._id,
      related_user: req.body.related_user,
    });
    const saveProject = await project.save();
    return res.status(200).json({
      status: 200,
      message: "Tạo dự án thành công",
      data: saveProject,
    });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};
exports.getProjects = async (req, res) => {
  try {
    const features = new Features(projectsDB.find(), req.query).sorting().paginating().searching().filtering();

    const counting = new Features(projectsDB.find(), req.query).sorting().searching().filtering().counting();
    const result = await Promise.allSettled([
      features.query,
      counting.query, //count number of user.
    ]);

    const project = result[0].status === "fulfilled" ? result[0].value : [];
    const count = result[1].status === "fulfilled" ? result[1].value : 0;

    return res.status(200).json({
      status: 200,
      data: project,
      count: count,
    });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};
exports.getProject = async (req, res) => {
  try {
    const data = await projectsDB.findById(req.params.id);
    return res.status(200).json({ status: 200, data });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};
exports.updateProject = async (req, res) => {
  try {
    const data = await projectsDB.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json({ status: 200, message: "Cập nhật thành công", data });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};
exports.deleteProject = async (req, res) => {
  try {
    await projectsDB.findByIdAndDelete(req.params.id);
    return res.status(200).json({ status: 200, message: "Xóa thành công" });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};
