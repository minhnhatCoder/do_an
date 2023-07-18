const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  resource_type: {
    type: String,
  },
  public_id: String,
});

module.exports = filesModel = mongoose.model("files", fileSchema);
