const commandKeys = require("../TelegramBot/commandKeys");

const generateKeyboardWithCallback = ({
  buttons,
  countInLine,
  options = {},
}) => {
  const keyboard = buttons.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / countInLine);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = []; // start a new chunk
    }

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []);

  const result = {
    resize_keyboard: true,
    inline_keyboard: keyboard,
  };

  return {
    reply_markup: JSON.stringify(result),
    ...options,
  };
};

const keyBoards = {
  generateKeyboardWithCallback,

  homeMenu: (lang = "en") => ({
    reply_markup: JSON.stringify({
      resize_keyboard: true,
      keyboard: [
        [commandKeys.myTemplates.texts[lang]],
        [
          commandKeys.createTemplate.texts[lang],
          commandKeys.deleteTemplate.texts[lang],
        ],
        [commandKeys.settings.texts[lang], commandKeys.donate.texts[lang]],
      ],
    }),
  }),
  backHome: (lang = "en", onlyKeyboard) => {
    const keyboard = [[commandKeys.backHome.texts[lang]]];

    return onlyKeyboard
      ? keyboard
      : {
          reply_markup: JSON.stringify({
            resize_keyboard: true,
            keyboard,
          }),
        };
  },
  settings: (lang = "en") => ({
    reply_markup: JSON.stringify({
      resize_keyboard: true,
      keyboard: [
        [commandKeys.changeLang.texts[lang]],
        [commandKeys.backHome.texts[lang]],
      ],
    }),
  }),
};

module.exports = keyBoards;
