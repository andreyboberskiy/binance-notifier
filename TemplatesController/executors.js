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
          currentRate: rate,
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
          currentRate: rate,
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
};
