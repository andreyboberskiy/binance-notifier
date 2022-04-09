require("dotenv").config({ path: `.env.${process.env.NODE_ENV_PATH}` });

console.log({ nodeEnv: process.env.NODE_ENV_PATH });

module.exports = {
  telegramBotToken: process.env.TELEGRAM_BOT_API_KEY,
  binanceSocketUrl: process.env.BINANCE_SOCKET_URL,
  mongoDB: process.env.MONGOOSE_DB_KEY,
  isDev: process.env.NODE_ENV === "development",
  mixPanelToken: process.env.MIXPANEL_API_TOKEN,
};
