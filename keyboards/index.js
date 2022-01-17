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

  return {
    reply_markup: JSON.stringify({
      resize_keyboard: true,
      inline_keyboard: keyboard,
    }),
    ...options,
  };
};
// const generateDefaultRowButtons = (texts, keyboard) => {
//   return {
//     reply_markup: JSON.stringify({
//       resize_keyboard: true,
//       keyboard: generateKeyboard(texts),
//     }),
//   };
// };
// const generateDefaultRowButtonsInline = (texts) => {
//   return {
//     reply_markup: JSON.stringify({
//       resize_keyboard: true,
//       inline_keyboard: generateKeyboardInline(texts),
//     }),
//   };
// };

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
  backHome: (lang = "en") => ({
    reply_markup: JSON.stringify({
      resize_keyboard: true,
      keyboard: [[commandKeys.backHome.texts[lang]]],
    }),
  }),
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
