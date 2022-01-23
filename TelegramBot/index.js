process.env.NTBA_FIX_319 = 1;

const TelegramBotApi = require("node-telegram-bot-api");

const appConfig = require("../configs/appConfig");

const onMessageListener = require("./listeners/onMessageListener");
const onCallbackDataListener = require("./listeners/onCallbackDataListener");

const token = appConfig.telegramBotToken;

class TelegramBot {
  bot = null;

  async init() {
    const bot = new TelegramBotApi(token, {
      polling: true,
    });
    this.bot = bot;

    bot.on("polling_error", console.log);

    await bot.on("message", (data) => this.handleMessage(data, bot));
    await bot.on("callback_query", (data) => this.handleCallback(data, bot));

    console.log("Bot inited");
    return bot;
  }

  handleMessage(data, bot) {
    const sendMessage = (text, options = {}) => {
      const chatId = data.chat.id;
      bot.sendMessage(chatId, text, {
        ...options,
        parse_mode: "Markdown",
      });
    };
    onMessageListener(data, sendMessage);
  }

  handleCallback(data, bot) {
    const sendMessage = (text, options = {}) => {
      const chatId = data.message.chat.id;
      bot.sendMessage(chatId, text, {
        ...options,
        parse_mode: "Markdown",
      });
    };
    onCallbackDataListener(data, sendMessage);
  }
}

module.exports = new TelegramBot();
