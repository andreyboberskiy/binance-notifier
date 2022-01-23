const keyboards = require("../../keyboards");
const callbackCommandKeys = require("../callbackCommandKeys");

const UsersModel = require("../../DB/models/Users");
const TemplatesModel = require("../../DB/models/Templates");
const doSafely = require("../../errors/doSafely");

const translate = require("../../locales/translate");
const { getUserByChatID } = require("../../DB/services/userService");
const waitForMessageKeys = require("../../configs/waitForMessageKeys");
const { templatesType } = require("../../TelegramBot/callbackCommandKeys");
const RateCache = require("../../RateCache");

const popularDirections = [
  "BTC/USDT",
  "ETH/USDT",
  "LUNA/USDT",
  "FTM/USDT",
  "SOL/USDT",
  "ADA/USDT",
  "SHIB/USDT",
  "XRP/USDT",
  "DOT/USDT",
  "MASK/USDT",
  "BURGER/USDT",
  "ICP/USDT",
  "CAKE/USDT",
];

module.exports = {
  start: async (sendMessage) => {
    await sendMessage(
      `Привет🙂 Выбери язык\n\nHi🙂 choose your language`,
      keyboards.generateKeyboardWithCallback({
        buttons: [
          {
            text: "RU 🇷🇺",
            callback_data: JSON.stringify({
              c: callbackCommandKeys.setLanguage,
              p: { l: "ru" },
            }),
          },
          {
            text: "EN 🇺🇸",
            callback_data: JSON.stringify({
              c: callbackCommandKeys.setLanguage,
              p: { l: "en" },
            }),
          },
        ],
        countInLine: 2,
      })
    );
  },

  changeLanguage: async (sendMessage) => {
    await sendMessage(
      "CHOOSE_NEW_LANG",
      keyboards.generateKeyboardWithCallback({
        buttons: [
          {
            text: "RU 🇷🇺",
            callback_data: JSON.stringify({
              c: callbackCommandKeys.setLanguage,
              p: { l: "ru", change: true },
            }),
          },
          {
            text: "EN 🇺🇸",
            callback_data: JSON.stringify({
              c: callbackCommandKeys.setLanguage,
              p: { l: "en", change: true },
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

      const getTemplateDescKey = (templateType) => {
        switch (templateType) {
          case templatesType.tracking: {
            return "TEMPLATE_DESC_TRACKING";
          }
          case templatesType.lessThan: {
            return "TEMPLATE_DESC_LESS_THAN";
          }
          case templatesType.moreThan: {
            return "TEMPLATE_DESC_MORE_THAN";
          }
          default: {
            return "Not found";
          }
        }
      };

      const message = `${translate("YOU_HAVE_COUNT_TEMPLATES", userLang, {
        count: templates.length,
      })}${templates
        .map((t) =>
          translate(getTemplateDescKey(t.type), userLang, {
            identifier: t._id,
            templateType: translate(t.type, userLang),
            direction: t.meta.direction,
            rateValue: t.meta.rateValue,
            currentRate: RateCache.rates[t.meta.direction]?.toFixed(4) || "-",
            lastRate: t.meta.lastRate || "-",
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
                c: callbackCommandKeys.templatesType.moreThan,
                p: { l: lang },
              }),
            },
            {
              text: translate("LESS_THAN_CALLBACK", lang),
              callback_data: JSON.stringify({
                c: callbackCommandKeys.templatesType.lessThan,
                p: { l: lang },
              }),
            },
            {
              text: translate("TRACKING_CALLBACK", lang),
              callback_data: JSON.stringify({
                c: callbackCommandKeys.templatesType.tracking,
                p: { l: lang },
              }),
            },
          ],
          countInLine: 2,
        })
      );
    });
  },
  backHome: async (sendMessage, userDB) => {
    userDB.waitFor = {};
    await userDB.save();
    sendMessage("MAIN_MENU", keyboards.homeMenu(userDB.lang));
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
              c: callbackCommandKeys.deleteTemplate,
              p: { id: t._id, l: userDB.lang },
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
    chatID,
    sendMessage,
    templateType,
  }) => {
    const user = await getUserByChatID(chatID);

    user.waitFor = {
      key: waitForMessageKeys.direction,
      data: { templateType },
    };
    await user.save();

    const buttonsAndKeyboard = keyboards.generateKeyboardWithCallback({
      buttons: popularDirections.map((direction) => ({
        text: direction,
        callback_data: JSON.stringify({
          c: callbackCommandKeys.setDirection,
          p: { d: direction, l: user.lang },
        }),
      })),
      countInLine: 4,
    });

    sendMessage("SEND_DIRECTION", buttonsAndKeyboard);
  },

  deleteTemplate: async ({ payload, sendMessage }) => {
    const template = await TemplatesModel.findOne({ _id: payload.id });

    if (template) {
      await template.remove();
      sendMessage("TEMPLATE_WAS_DELETED");
    } else {
      sendMessage("TEMPLATE_NOT_FOUND");
    }
  },

  askForDonateAmount: async (sendMessage, userDB) => {
    userDB.waitFor = { key: waitForMessageKeys.donate };
    await userDB.save();
    sendMessage("ENTER_DONATE_AMOUNT");
  },
};
