"use strict";

const express = require("express");
const { upload } = require("../helpers/filehelper");
const {
  singleFileUpload,
  multipleFileUpload,
  getallSingleFiles,
  getallMultipleFiles,
  companyAllData,
} = require("../controllers/fileuploaderController");
const router = express.Router();

router.post("/singleFile", upload.single("file"), singleFileUpload);
router.post("/multipleFiles", upload.array("files"), multipleFileUpload);
router.post("/companyAllData", upload.array("files"), companyAllData);
router.get("/getSingleFiles", getallSingleFiles);
router.get("/getMultipleFiles", getallMultipleFiles);

module.exports = {
  routes: router,
};
