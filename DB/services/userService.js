const doSafely = require("../../errors/doSafely");
const UserModes = require("../models/Users");

module.exports.getUserByChatID = async (chatID) => {
  return doSafely(() => UserModes.findOne({ chatID }));
};

module.exports.clearUserWaitFor = async (chatID) => {
  return UserModes.updateOne({ chatID }, { waitFor: {} });
};
