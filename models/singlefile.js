const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const singleFileSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    typeP: {
      type: String,
      required: true,
    },
    formP: {
      type: String,
      required: true,
    },
    packagingT: {
      type: String,
      required: true,
    },
    packagingS: {
      type: String,
      required: true,
    },
    compositions: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    fileSize: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SingleFile", singleFileSchema);
