const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  telegramBotToken: process.env.TELEGRAM_BOT_API_KEY,
  binanceSocketUrl: process.env.BINANCE_SOCKET_URL,
  mongoDB: process.env.MONGOOSE_DB_KEY,
};
