const callbackCommandKeys = require("../callbackCommandKeys");
const controllers = require("../controllers");
const keyboards = require("../../keyboards");
const { getUserByChatID } = require("../../DB/services/userService");
const waitForMessageKeys = require("../../configs/waitForMessageKeys");

module.exports = async (
  {
    data,
    from: { first_name },
    message: {
      chat: { id: chatID },
    },
  },
  sendMessage
) => {
  const { command, payload } = JSON.parse(data);

  switch (command) {
    case callbackCommandKeys.setLanguage: {
      const lang = payload.value;

      await controllers.setLanguage(chatID, lang, first_name);

      sendMessage(
        payload.change ? "LANG_CHANGED" : "CREATE_TEMPLATE",
        lang,
        keyboards.homeMenu(lang)
      );
      break;
    }
    case callbackCommandKeys.templatesType.moreThan: {
      await controllers.getTemplateTypeAndAskDirection({
        payload,
        sendMessage,
        chatID,
        templateType: callbackCommandKeys.templatesType.moreThan,
      });
      break;
    }
    case callbackCommandKeys.templatesType.lessThan: {
      await controllers.getTemplateTypeAndAskDirection({
        payload,
        sendMessage,
        chatID,
        templateType: callbackCommandKeys.templatesType.lessThan,
      });
      break;
    }
    default: {
      sendMessage("CANT_UNDERSTAND", "en");
    }
  }
};
