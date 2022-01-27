process.env.NTBA_FIX_319 = 1;
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const TelegramBot = require("./TelegramBot");
const Analytic = require("./Analytic");
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

    Analytic.init();
  } catch (e) {
    console.log("Start internal error", e);
  }
}

start();
