const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  public_id: String,
});

module.exports = filesModel = mongoose.model("files", fileSchema);
