const doSafely = require("../../errors/doSafely");
const UserModes = require("../models/Users");

module.exports.getUserByChatID = async (chatID) => {
  return doSafely(() => UserModes.findOne({ chatID }));
};
