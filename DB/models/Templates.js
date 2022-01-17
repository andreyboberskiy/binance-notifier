const { Schema, model } = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const callbackCommandKeys = require("../../TelegramBot/callbackCommandKeys");

const TemplatesSchema = new Schema({
  type: {
    type: String,
    enum: Object.values(callbackCommandKeys.templatesType),
    required: true,
  },
  userId: { type: Number, ref: "Users" },
  userChatID: { type: Number, required: true },
  meta: {
    rateValue: { type: Number },
    direction: { type: String, required: true },
    lastRate: { type: Number },
  },
});

TemplatesSchema.plugin(autoIncrement.plugin, "Templates");

module.exports = model("Templates", TemplatesSchema);
