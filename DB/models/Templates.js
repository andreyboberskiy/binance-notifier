const { Schema, model } = require("mongoose");

const callbackCommandKeys = require("../../TelegramBot/callbackCommandKeys");

const TemplatesSchema = new Schema({
  type: {
    type: String,
    enum: Object.values(callbackCommandKeys.templatesType),
    required: true,
  },
  userId: { type: Schema.Types.ObjectId, ref: "Users" },
  userChatID: { type: Number, required: true },
  meta: {
    rateValue: { type: Number },
    direction: { type: String, required: true },
    lastRate: { type: Number },
  },
});

module.exports = model("Templates", TemplatesSchema);
