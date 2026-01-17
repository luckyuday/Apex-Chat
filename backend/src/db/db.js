const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Db is connected");
  } catch (error) {
    console.error("Error while connecting to Db.", error);
  }
};
module.exports = connectDb;
