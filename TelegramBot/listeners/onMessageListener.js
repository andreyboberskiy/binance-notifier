const { getCommandByText } = require("../utils");
const commandKeys = require("../commandKeys");
const keyboards = require("../../keyboards");
const commandControllers = require("../controllers");
const UsersModel = require("../../DB/models/Users");
const waitForMessageKeys = require("../../configs/waitForMessageKeys");
const waitForMessageController = require("../controllers/waitForMessageController");

module.exports = async (message, sendMessage) => {
  try {
    console.log(
      `MESSAGE FROM ${message.from.first_name}(${message.from.username}): ${message.text}`
    );
    const chatID = message.chat.id;
    const text = message.text;

    const command = getCommandByText(text);

    let userDB = await UsersModel.findOne({ chatID });

    if (!userDB) {
      userDB = await UsersModel.create({
        chatID,
        lang: "en",
        firstName: message.from.first_name,
      });
    }

    const userLang = userDB.lang;
    const waitForKey = userDB?.waitFor?.key;

    const sendMessageWithLang = (text, options = {}) => {
      const lang = userLang || options.lang;
      sendMessage(text, lang, options);
    };

    switch (command) {
      case commandKeys.myTemplates.key: {
        await commandControllers.myTemplates(
          chatID,
          sendMessageWithLang,
          userLang
        );
        return;
      }
      case commandKeys.createTemplate.key: {
        await commandControllers.createTemplate(
          chatID,
          sendMessageWithLang,
          userLang
        );
        return;
      }
      case commandKeys.backHome.key: {
        await commandControllers.backHome(sendMessageWithLang, userDB);
        return;
      }
      case commandKeys.deleteTemplate.key: {
        await commandControllers.onDeleteTemplateMessage(
          sendMessageWithLang,
          userDB
        );
        return;
      }
      case commandKeys.settings.key: {
        await sendMessageWithLang("SETTINGS", keyboards.settings(userLang));
        return;
      }
      case commandKeys.changeLang.key: {
        await commandControllers.changeLanguage(sendMessageWithLang, userLang);
        return;
      }
      case commandKeys.start.key: {
        await commandControllers.start(
          sendMessage,
          chatID,
          message.from.first_name
        );
        return;
      }
      default: {
        break;
      }
    }

    if (waitForKey) {
      switch (waitForKey) {
        case waitForMessageKeys.direction: {
          await waitForMessageController.direction({
            text,
            sendMessageWithLang,
            userDB,
          });
          return;
        }
        case waitForMessageKeys.rate: {
          await waitForMessageController.rate({
            text,
            sendMessageWithLang,
            userDB,
          });
          return;
        }
        default: {
          await commandControllers.backHome(sendMessageWithLang, userDB);
          break;
        }
      }
    }

    sendMessageWithLang("CANT_UNDERSTAND", {
      options: keyboards.homeMenu(userDB?.lang),
    });
  } catch (e) {
    console.log("OnMessageListener error", e);
  }
};
