const { tasksDB, projectsDB } = require("./model");
const { commentsDB } = require("../comment/model");
const Features = require("../../libs/feature");
const dayjs = require("dayjs");
const usersDB = require("../auth/model");
const NotificationDB = require("../noti/model");


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
    const { noti_content, ...rest } = req.body;
    const data = await tasksDB.findByIdAndUpdate(req.params.id, { ...rest }, {
      new: true,
    });
    if (noti_content) {
      const task = await tasksDB.findById(req.params.id);
      const user = await usersDB.findById(req.user_data._id);
      // Danh sách các người nhận (ví dụ)
      const recipients = task?.related_user.filter((u) => u != req.user_data._id); // Thay thế bằng danh sách người nhận thực tế

      // Tạo thông báo cho mỗi người nhận
      for (const recipientId of recipients) {
        const notification = new NotificationDB({
          recipient: recipientId,
          content: `${user?.display_name} ${noti_content}`,
          type: "task",
          related_id: req.params.id,
          created_at: dayjs(new Date()).unix(),
        });

        await notification.save();
      }
    }

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
          comments: savedComment?._id,
        },
      },
      {
        new: true,
      }
    );
    const task = await tasksDB.findById(req.params.id);
    const user = await usersDB.findById(req.user_data._id);
    // Danh sách các người nhận (ví dụ)
    const recipients = task?.related_user.filter((u) => u != req.user_data._id); // Thay thế bằng danh sách người nhận thực tế

    // Tạo thông báo cho mỗi người nhận
    for (const recipientId of recipients) {
      const notification = new NotificationDB({
        recipient: recipientId,
        content: `${user?.display_name} đã bình luận công việc`,
        type: "task",
        related_id: req.params.id,
        created_at: dayjs(new Date()).unix(),
      });

      await notification.save();
    }
    return res.status(200).json({ status: 200, message: "Bình luận thành công", data: savedComment });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};

exports.getStatistics = async (req, res) => {

  const { start_date, end_date, dept_id, status } = req.query;
  try {
    // Lấy danh sách người dùng trong phòng ban
    const users = await usersDB.find({ department: dept_id });

    // Lấy danh sách ID người dùng từ kết quả truy vấn
    const getTasks = async (user_id) => {
      const tasks = await tasksDB.find({
        reciever: {
          $eq: user_id,
        },
        start_date: {
          $gte: start_date,
          $lte: end_date,
        },
      }).populate("reciever", ["display_name", "image"])
        .populate("project", ["title"])
        .populate("assigner", ["display_name", "image"])
      return tasks
    }
    let statistic = []
    await Promise.all(users.map(async (user) => {
      const tasks = await getTasks(user._id);
      statistic.push({
        user: {
          _id: user._id,
          display_name: user.display_name,
          image: user.image,
        },
        task_todo: tasks?.filter(t => t?.status == 1).length,
        task_doing: tasks?.filter(t => t?.status == 2).length,
        task_complete: tasks?.filter(t => t?.status == 3).length,
        task_cancel: tasks?.filter(t => t?.status == 4).length,
        tasks: tasks
      })
    }))

    return res.status(200).json({ status: 200, message: "Thống kê thành công", data: statistic.reverse() });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
}

////project
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
