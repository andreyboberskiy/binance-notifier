process.env.NTBA_FIX_319 = 1;

const TelegramBot = require("./TelegramBot");
const BinanceObserver = require("./BinanceObserver");
const TemplatesController = require("./TemplatesController");
const RateCache = require("./RateCache");
const DB = require("./DB");

async function start() {
  try {
    DB.init();
    TelegramBot.init();

    await BinanceObserver.init();
    BinanceObserver.listen(TemplatesController.subscriber);
    BinanceObserver.listen(RateCache.subscriber);
  } catch (e) {
    console.log("Start internal error", e);
  }
}

start();
