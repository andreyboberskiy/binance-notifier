const TemplatesModel = require("../DB/models/Templates");
const { getUserByChatID } = require("../DB/services/userService");
const translate = require("../locales/translate");

module.exports = {
  moreThan: async (template, directionData, bot) => {
    const { meta, userChatID, _id } = template;
    const { direction, rate } = directionData;

    if (rate >= parseInt(meta.rateValue)) {
      const user = await getUserByChatID(userChatID);

      await bot.sendMessage(
        userChatID,
        translate("NOTIFY_MORE_THAN", user.lang, {
          direction,
          userRate: meta.rateValue,
          currentRate: rate.toFixed(2),
        }),
        {
          parse_mode: "Markdown",
        }
      );
      try {
        await TemplatesModel.deleteOne({ _id });
      } catch (e) {
        console.log(e);
      }
    }
  },
  lessThan: async (template, directionData, bot) => {
    const { meta, userChatID, _id } = template;
    const { direction, rate } = directionData;

    if (rate <= parseInt(meta.rateValue)) {
      const user = await getUserByChatID(userChatID);

      await bot.sendMessage(
        userChatID,
        translate("NOTIFY_LESS_THAN", user.lang, {
          direction,
          userRate: meta.rateValue,
          currentRate: rate.toFixed(2),
        }),
        {
          parse_mode: "Markdown",
        }
      );
      try {
        await TemplatesModel.deleteOne({ _id });
      } catch (e) {
        console.log(e);
      }
    }
  },

  tracking: async (template, directionData, bot) => {
    const { meta, userChatID, _id } = template;
    let { direction, rate } = directionData;

    const changeValue = rate - meta.lastRate;

    if (Math.abs(changeValue) >= meta.rateValue) {
      const user = await getUserByChatID(userChatID);

      await bot.sendMessage(
        userChatID,
        translate("NOTIFY_TRACKING", user.lang, {
          direction,
          userRate: `${changeValue > 0 ? "🟢" : "🔻"}${changeValue.toFixed(2)}`,
          currentRate: rate.toFixed(2),
        }),
        {
          parse_mode: "Markdown",
        }
      );

      template.meta = { ...template.meta, lastRate: Number(rate) };
      await template.save();
    }
  },
};
