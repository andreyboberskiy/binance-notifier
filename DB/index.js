const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const appConfig = require("../configs/appConfig");

class DB {
  async init() {
    try {
      await mongoose.connect(appConfig.mongoDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      console.log("Mongo DB connected");
    } catch (e) {}
  }
}

module.exports = new DB();
