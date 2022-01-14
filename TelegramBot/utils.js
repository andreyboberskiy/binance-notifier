const commandKeys = require("./commandKeys");

module.exports.getCommandByText = (text) => {
  let command = null;
  Object.values(commandKeys).forEach(({ key, texts }) => {
    if (command) {
      return;
    }
    Object.values(texts).forEach((textCommand) => {
      if (text === textCommand) {
        command = key;
      }
    });
  });
  return command;
};
