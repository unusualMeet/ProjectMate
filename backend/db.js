const mongoose = require("mongoose");

const connectToMongo = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/projectmate");
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = connectToMongo;