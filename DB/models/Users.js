const { Schema, model } = require("mongoose");

const waitForMessageKeys = require("../../configs/waitForMessageKeys");

const UsersSchema = new Schema({
  chatID: { type: Number, required: true, unique: true },
  firstName: { type: String, required: true },
  lang: { type: String, enum: ["ru", "en"], required: true },
  templates: [{ type: Schema.Types.ObjectId, ref: "Templates" }],
  waitFor: {
    key: { type: String, enum: Object.values(waitForMessageKeys) },
    data: { type: Object },
  },
});

module.exports = model("Users", UsersSchema);
