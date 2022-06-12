const connectToMongo = require("./db");
const express = require("express");
var cors = require("cors");
var logger = require("morgan");
require("dotenv").config();
connectToMongo();
const app = express();
const path = require("path");
const fileRoutes = require("./routes/file-upload-routes");
const port = 5000;

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use("/images", express.static(__dirname + "/uploads//"));

// console.log(
//   __dirname + "/uploads/2022-05-26T17-02-29.546Z-IMG_20210920_000129.jpg"
// );

// Available Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));
app.use("/api/company", require("./routes/company"));
app.use("/api/uploads", express.static(path.join(__dirname, "/uploads//")));

app.use("/api/company/upload", fileRoutes.routes);

var parse = require("./routes/contact");
app.use("/api/contact", parse);

// app.use("/api/contact", require("./routes/contact"));

app.listen(process.env.PORT || port, () => {
  console.log(`PharamaWeb backend listening at http://localhost:${port}`);
});
