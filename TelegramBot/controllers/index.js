const keyboards = require("../../keyboards");
const callbackCommandKeys = require("../callbackCommandKeys");

const UsersModel = require("../../DB/models/Users");
const TemplatesModel = require("../../DB/models/Templates");
const doSafely = require("../../errors/doSafely");

const translate = require("../../locales/translate");
const { getUserByChatID } = require("../../DB/services/userService");
const waitForMessageKeys = require("../../configs/waitForMessageKeys");

module.exports = {
  start: async (sendMessage) => {
    await sendMessage(
      `Привет🙂 Выбери язык\n\nHi🙂 choose your language`,
      null,
      keyboards.generateKeyboardWithCallback({
        buttons: [
          {
            text: "RU 🇷🇺",
            callback_data: JSON.stringify({
              command: callbackCommandKeys.setLanguage,
              payload: { value: "ru" },
            }),
          },
          {
            text: "EN 🇺🇸",
            callback_data: JSON.stringify({
              command: callbackCommandKeys.setLanguage,
              payload: { value: "en" },
            }),
          },
        ],
        countInLine: 2,
      })
    );
  },

  changeLanguage: async (sendMessage, lang) => {
    await sendMessage(
      "CHOOSE_NEW_LANG",
      keyboards.generateKeyboardWithCallback({
        buttons: [
          {
            text: "RU 🇷🇺",
            callback_data: JSON.stringify({
              command: callbackCommandKeys.setLanguage,
              payload: { value: "ru", change: true },
            }),
          },
          {
            text: "EN 🇺🇸",
            callback_data: JSON.stringify({
              command: callbackCommandKeys.setLanguage,
              payload: { value: "en", change: true },
            }),
          },
        ],
        countInLine: 2,
      })
    );
  },

  setLanguage: async (chatID, lang, firstName) => {
    await doSafely(async () => {
      const candidate = await UsersModel.findOne({ chatID });

      if (candidate) {
        candidate.lang = lang;
        await candidate.save();
      } else {
        await UsersModel.create({ chatID, lang, firstName });
      }
    });
  },

  myTemplates: async (chatID, sendMessage, userLang) => {
    await doSafely(async () => {
      const templates = await TemplatesModel.find({ userChatID: chatID });

      if (templates.length === 0) {
        await sendMessage("HAVENT_TEMPLATES");
        return;
      }

      const message = `${translate("YOU_HAVE_COUNT_TEMPLATES", userLang, {
        count: templates.length,
      })}${templates
        .map((t) =>
          translate("TEMPLATE_DESC", userLang, {
            identifier: t._id,
            templateType: translate(t.type, userLang),
            direction: t.meta.direction,
            rateValue: t.meta.rateValue,
          })
        )
        .join("")}`;

      await sendMessage(message);
    });
  },

  createTemplate: async (chatID, sendMessage, lang) => {
    await doSafely(async () => {
      sendMessage(
        "CHOOSE_TEMPLATE_TYPE",
        keyboards.generateKeyboardWithCallback({
          buttons: [
            {
              text: translate("MORE_THAN_CALLBACK", lang),
              callback_data: JSON.stringify({
                command: callbackCommandKeys.templatesType.moreThan,
                payload: { lang },
              }),
            },
            {
              text: translate("LESS_THAN_CALLBACK", lang),
              callback_data: JSON.stringify({
                command: callbackCommandKeys.templatesType.lessThan,
                payload: { lang },
              }),
            },
            {
              text: translate("TRACKING_CALLBACK", lang),
              callback_data: JSON.stringify({
                command: callbackCommandKeys.templatesType.tracking,
                payload: { lang },
              }),
            },
          ],
          countInLine: 2,
          options: { parse_mode: "Markdown" },
        })
      );
    });
  },
  backHome: async (sendMessage, userDB) => {
    userDB.waitFor = {};
    await userDB.save();
    sendMessage("🙃", keyboards.homeMenu(userDB.lang));
  },

  onDeleteTemplateMessage: async (sendMessage, userDB) => {
    const templates = await TemplatesModel.find({ userId: userDB._id });

    if (templates?.length > 0) {
      sendMessage(
        "SELECT_TEMPLATE_ID",
        keyboards.generateKeyboardWithCallback({
          buttons: templates.map((t) => ({
            text: t._id.toString(),
            callback_data: JSON.stringify({
              command: callbackCommandKeys.deleteTemplate,
              payload: { id: t._id, lang: userDB.lang },
            }),
          })),
          countInLine: 4,
          options: { parse_mode: "Markdown" },
        })
      );
    } else {
      sendMessage("HAVENT_TEMPLATES");
    }
  },

  getTemplateTypeAndAskDirection: async ({
    payload,
    chatID,
    sendMessage,
    templateType,
  }) => {
    const { lang } = payload;
    const user = await getUserByChatID(chatID);

    user.waitFor = {
      key: waitForMessageKeys.direction,
      data: { templateType },
    };
    await user.save();
    sendMessage("SEND_DIRECTION", lang, keyboards.backHome(lang));
  },

  deleteTemplate: async ({ payload, sendMessage }) => {
    const template = await TemplatesModel.findOne({ _id: payload.id });

    if (template) {
      await template.remove();
      sendMessage("TEMPLATE_WAS_DELETED", payload.lang);
    } else {
      sendMessage("TEMPLATE_NOT_FOUND", payload.lang);
    }
  },
};
