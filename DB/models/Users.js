const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const autoIncrement = require("mongoose-auto-increment");

const waitForMessageKeys = require("../../configs/waitForMessageKeys");

const UsersSchema = new Schema({
  chatID: { type: Number, required: true, unique: true },
  firstName: { type: String, required: true },
  lang: { type: String, enum: ["ru", "en"], required: true },
  templates: [{ type: Number, ref: "Templates" }],
  waitFor: {
    key: { type: String, enum: Object.values(waitForMessageKeys) },
    data: { type: Object },
  },
});

autoIncrement.initialize(mongoose.connection);
UsersSchema.plugin(autoIncrement.plugin, "Users");

module.exports = model("Users", UsersSchema);
