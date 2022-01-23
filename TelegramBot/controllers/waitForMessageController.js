const axios = require("axios");

const RateCache = require("../../RateCache");
const waitForMessageKeys = require("../../configs/waitForMessageKeys");
const callbackCommandKeys = require("../callbackCommandKeys");
const translate = require("../../locales/translate");
const TemplatesModel = require("../../DB/models/Templates");
const keyboards = require("../../keyboards");
const { clearUserWaitFor } = require("../../DB/services/userService");

module.exports = {
  direction: async ({ text, sendMessageWithLang, userDB }) => {
    let parsedDirection = text.toUpperCase();

    if (parsedDirection.includes("/")) {
      parsedDirection = parsedDirection.split("/").join("");
    }

    const currentRate = RateCache.rates[parsedDirection];

    if (!currentRate) {
      sendMessageWithLang("DIRECTION_INVALID");
      return;
    }
    userDB.waitFor = {
      key: waitForMessageKeys.rate,
      data: { ...userDB.waitFor.data, direction: parsedDirection },
    };
    await userDB.save();

    let responseKey = "SEND_RATE_MORE_THAN";

    switch (userDB.waitFor.data.templateType) {
      case callbackCommandKeys.templatesType.lessThan: {
        responseKey = "SEND_RATE_LESS_THAN";
        break;
      }
      case callbackCommandKeys.templatesType.tracking: {
        responseKey = "SEND_RATE_TRACKING";
        break;
      }
      default: {
        break;
      }
    }

    let additionalLabel = "";

    if (
      userDB.waitFor.data.templateType ===
      callbackCommandKeys.templatesType.tracking
    ) {
      additionalLabel = translate("TRACKING_RECOMMENDED_AMOUNT", userDB.lang, {
        recommendedAmount: Number((currentRate / 100) * 10).toFixed(2),
      });
    }

    sendMessageWithLang(
      `${translate(
        responseKey,
        userDB.lang
      )} ${currentRate}\n\n${additionalLabel}`
    );
  },
  rate: async ({ text, userDB, sendMessageWithLang }) => {
    const rate = parseFloat(text.replaceAll(",", ".").replaceAll(" ", "."));
    const waitFor = { ...userDB.waitFor };

    if (rate && !isNaN(rate) && rate >= 0) {
      let currentRate = RateCache.rates[userDB.waitFor.data.direction];
      const userLang = userDB.lang;

      if (currentRate) {
        currentRate = parseFloat(currentRate);

        switch (userDB.waitFor.data.templateType) {
          case callbackCommandKeys.templatesType.moreThan: {
            if (currentRate >= rate) {
              sendMessageWithLang(
                translate("RATE_MUST_BE_MORE", userLang, {
                  currentRate,
                  userRate: rate,
                })
              );
              return;
            }
            break;
          }
          case callbackCommandKeys.templatesType.lessThan: {
            if (currentRate <= rate) {
              sendMessageWithLang(
                translate("RATE_MUST_BE_LESS", userLang, {
                  currentRate,
                  userRate: rate,
                })
              );
              return;
            }
            break;
          }

          default: {
            break;
          }
        }
      }

      const templateMeta = {
        direction: userDB.waitFor.data.direction,
        rateValue: rate,
      };

      if (
        waitFor.data.templateType === callbackCommandKeys.templatesType.tracking
      ) {
        templateMeta.lastRate = Number(currentRate);
      }

      const template = await TemplatesModel.create({
        userId: userDB._id,
        userChatID: userDB.chatID,
        type: userDB.waitFor.data.templateType,
        meta: templateMeta,
      });
      userDB.templates = [...userDB.templates, template._id];
      userDB.waitFor = {};

      await userDB.save();
      await template.save();

      let templateCreatedKey = "TEMPLATE_CREATED_MORE_THAN";

      switch (waitFor.data.templateType) {
        case callbackCommandKeys.templatesType.lessThan: {
          templateCreatedKey = "TEMPLATE_CREATED_LESS_THAN";
          break;
        }
        case callbackCommandKeys.templatesType.tracking: {
          templateCreatedKey = "TEMPLATE_CREATED_TRACKING";
          break;
        }
        default: {
          break;
        }
      }

      sendMessageWithLang(
        translate(templateCreatedKey, userLang, {
          direction: waitFor.data.direction,
          userRate: rate,
        }),
        keyboards.homeMenu(userLang)
      );
    } else {
      sendMessageWithLang("ONLY_NUMBERS");
    }
  },

  donate: async (text, sendMessage, userDB) => {
    const amount = parseFloat(text);

    if (amount < 1) {
      sendMessage("DONATE_TOO_SMALL");

      return;
    } else if (amount > 100000) {
      sendMessage("DONATE_TOO_BIG");
      return;
    }
    await clearUserWaitFor(userDB.chatID);

    sendMessage("DONATE_GENERATE_REQ");

    const response = await axios.post(
      "https://yoomoney.ru/quickpay/confirm.xml",
      {
        receiver: "4100115898774763",
        "quickpay-form": "shop",
        paymentType: "AC",
        sum: amount * 76, // USD to RUB
        label: `BinanceNotifier:${userDB.chatID}:${userDB.firstName}`,
        targets: "Binance Notifier: поддержка проекта",
        formcomment: "Binance Notifier: поддержка проекта",
        "short-dest": "Binance Notifier: поддержка проекта",
      },
      { timeout: 10000 }
    );

    const paymentUrl = response?.request?.res?.responseUrl;

    sendMessage(
      "DONATE_FINISH_STEP",
      keyboards.generateKeyboardWithCallback({
        buttons: [
          {
            text: translate("PAY", userDB.lang),
            url: paymentUrl,
          },
        ],
        countInLine: 1,
      })
    );
  },
};
