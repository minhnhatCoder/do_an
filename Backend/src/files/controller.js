const cloudinary = require("../../helper/cloudinary");
const filesModel = require("./model");
const _ = require("lodash");
const path = require("path");

exports.upload = async (req, res) => {
  if (_.isEmpty(req.files)) {
    return res.status(400).json({ status: 400, message: "Vui lòng chọn file" });
  }
  try {
    const uploads = async (path, originalname) => {
      try {
        if (!path) return;
        const newPath = await cloudinary.uploader.upload(path, {
          folder: "files",
          resource_type: "raw",
          public_id: originalname,
        });
        let newFile = new filesModel({
          url: newPath.url,
          public_id: newPath.public_id,
        });
        // Save img
        const result = await newFile.save();
        return result;
      } catch (error) {
        return res.status(400).json({ status: 400, message: error });
      }
    };
    const files = req.files;

    // Upload files to cloudinary

    Promise.all(files.map((file) => uploads(file.path, file?.originalname)))
      .then((values) => {
        return res.status(200).json({ status: 200, files: values });
      })
      .catch((err) => {
        return res.status(400).json({ status: 400, message: err });
      });
  } catch (err) {
    return res.status(400).json({ status: 400, message: err });
  }
};
