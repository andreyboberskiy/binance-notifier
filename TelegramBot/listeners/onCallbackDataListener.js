const callbackCommandKeys = require("../callbackCommandKeys");
const controllers = require("../controllers");
const keyboards = require("../../keyboards");
const translate = require("../../locales/translate");
const waitForMessageController = require("../controllers/waitForMessageController");
const { getUserByChatID } = require("../../DB/services/userService");

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
  try {
    const { command, payload } = JSON.parse(data);

    const userLang = payload.lang;

    const sendMessageWithLang = (text, options = {}) =>
      sendMessage(translate(text, userLang), options);

    switch (command) {
      case callbackCommandKeys.setLanguage: {
        const newLang = payload.value;

        await controllers.setLanguage(chatID, newLang, first_name);

        sendMessageWithLang(
          payload.change ? "LANG_CHANGED" : "CREATE_TEMPLATE",
          keyboards.homeMenu(newLang)
        );
        break;
      }
      case callbackCommandKeys.templatesType.moreThan: {
        await controllers.getTemplateTypeAndAskDirection({
          payload,
          sendMessage: sendMessageWithLang,
          chatID,
          templateType: callbackCommandKeys.templatesType.moreThan,
        });
        break;
      }

      case callbackCommandKeys.templatesType.lessThan: {
        await controllers.getTemplateTypeAndAskDirection({
          payload,
          sendMessage: sendMessageWithLang,
          chatID,
          templateType: callbackCommandKeys.templatesType.lessThan,
        });
        break;
      }
      case callbackCommandKeys.templatesType.tracking: {
        await controllers.getTemplateTypeAndAskDirection({
          payload,
          sendMessage: sendMessageWithLang,
          chatID,
          templateType: callbackCommandKeys.templatesType.tracking,
        });
        break;
      }
      case callbackCommandKeys.setDirection: {
        const userDB = await getUserByChatID(chatID);
        await waitForMessageController.direction({
          text: payload.direction,
          sendMessageWithLang: (text, options) =>
            sendMessage(translate(text, userDB.lang), options),
          userDB,
        });
        break;
      }
      default: {
        sendMessageWithLang("CANT_UNDERSTAND");
      }
    }
  } catch (e) {
    console.log("OnCallbackDataListener", e);
  }
};
