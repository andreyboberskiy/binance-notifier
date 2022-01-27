const callbackCommandKeys = require("../callbackCommandKeys");
const controllers = require("../controllers");
const keyboards = require("../../keyboards");
const translate = require("../../locales/translate");
const waitForMessageController = require("../controllers/waitForMessageController");
const { getUserByChatID } = require("../../DB/services/userService");
const Analytic = require("../../Analytic");

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
    const { c: command, p: payload } = JSON.parse(data);

    const userLang = payload.l;

    const sendMessageWithLang = (text, options = {}) =>
      sendMessage(translate(text, userLang), options);

    Analytic.send("Callback", chatID, { command, payload });

    switch (command) {
      case callbackCommandKeys.setLanguage: {
        await controllers.setLanguage(chatID, userLang, first_name);

        sendMessageWithLang(
          payload.change ? "LANG_CHANGED" : "CREATE_TEMPLATE",
          keyboards.homeMenu(userLang)
        );
        break;
      }
      case callbackCommandKeys.deleteTemplate: {
        await controllers.deleteTemplate({
          payload,
          sendMessage: sendMessageWithLang,
        });
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
          text: payload.d,
          sendMessageWithLang: (text, options) =>
            sendMessage(translate(text, userLang), options),
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
