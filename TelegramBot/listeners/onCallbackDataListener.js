const callbackCommandKeys = require("../callbackCommandKeys");
const controllers = require("../controllers");
const keyboards = require("../../keyboards");

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
      case callbackCommandKeys.deleteTemplate: {
        await controllers.deleteTemplate({
          payload,
          sendMessage,
          chatID,
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
      case callbackCommandKeys.templatesType.tracking: {
        await controllers.getTemplateTypeAndAskDirection({
          payload,
          sendMessage,
          chatID,
          templateType: callbackCommandKeys.templatesType.tracking,
        });
        break;
      }
      default: {
        sendMessage("CANT_UNDERSTAND", "en");
      }
    }
  } catch (e) {
    console.log("OnCallbackDataListener", e);
  }
};
