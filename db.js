const mongoose = require("mongoose");

const mongoURI =
  // "mongodb://localhost:27017/inotebook?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";
  "mongodb+srv://Anmol:AnmolDhami@cluster0.t2rax.mongodb.net/pharma_tru_web?retryWrites=true&w=majority";
const connectToMongo = () => {
  mongoose.connect(mongoURI, () => {
    console.log("Connected to Mongo Atlas Successfully");
  });
};

module.exports = connectToMongo;
