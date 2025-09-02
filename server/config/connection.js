const mongoose = require("mongoose");

const connectToMongoDb = async (url) => {
  return await mongoose.connect(url);
};

module.exports = connectToMongoDb;
