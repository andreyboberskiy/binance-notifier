const TemplatesModel = require("../DB/models/Templates");
const TelegramBot = require("../TelegramBot");

const templateTypes = require("./templateTypes");

const templateExecutors = require("./executors");

class Templates {
  subscriber = async (data) => {
    const templates = await TemplatesModel.find({});
    templates.forEach((template) => {
      this.execTemplate(template, data);
    });
  };

  execTemplate(template, data) {
    const currentDirectionInfo = data.find((item) => {
      return item.direction === template.meta.direction;
    });

    if (!currentDirectionInfo) {
      return;
    }

    switch (template.type) {
      case templateTypes.moreThan: {
        templateExecutors.moreThan(
          template,
          currentDirectionInfo,
          TelegramBot.bot
        );
        break;
      }
      case templateTypes.lessThan: {
        templateExecutors.lessThan(
          template,
          currentDirectionInfo,
          TelegramBot.bot
        );
        break;
      }
      case templateTypes.tracking: {
        templateExecutors.tracking(
          template,
          currentDirectionInfo,
          TelegramBot.bot
        );
        break;
      }
      default: {
        return null;
      }
    }
  }
}

module.exports = new Templates();
