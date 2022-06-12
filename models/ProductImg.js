const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductImgSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    name: {
      type: String,
      required: true,
    },
    typep: {
      type: String,
      required: true,
    },
    compositions: {
      type: String,
      required: true,
    },
    usage: {
      type: String,
      required: true,
    },
    files: [Object],
  },
  { timestamps: true }
);

module.exports = mongoose.model("productimg", ProductImgSchema);
