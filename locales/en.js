module.exports = {
  CREATE_TEMPLATE: "Create your template for new notification ⬇️",
  CANT_UNDERSTAND: "Cant understand you 🤨",
  HAVENT_TEMPLATES: "You haven't got any templates yet 😢",
  CHOOSE_TEMPLATE_TYPE:
    "*Choose one of suggested templates: *\n\n*More than:* I will notify you when the rate of the selected currency is higher than the specified one\n*Less than:* I will notify you when the rate of the selected currency is lower than the specified one\n",
  MORE_THAN_CALLBACK: "More than 🔼",
  LESS_THAN_CALLBACK: "Less than 🔽",
  TRACKING_CALLBACK: "Tracking 📈",
  SEND_DIRECTION:
    "*Send direction like that:*\n\nBTC/USDT\nETH/USDT\nDASH/BTC\nICP/BUSB",
  DIRECTION_INVALID: "*Cant find this direction☹️*\nTry another",
  SEND_RATE_MORE_THAN:
    "Enter the rate value, if it goes up, which I will send you a notification.\n*Current rate value:*",
  SEND_RATE_LESS_THAN:
    "Enter the rate value, if it goes down, I will send you a notification.\n*Current rate value:*",
  SEND_RATE_TRACKING:
    "Enter the rate value, if it changes to *(up or down)* I will send you a notification.\n*Current rate value:*",
  TEMPLATE_CREATED: "*Template created*",
  ONLY_NUMBERS: "Send only numbers and separators like this: *, .*",
  RATE_MUST_BE_MORE:
    "Current rate value: *currentRate*\nYou sent: *userRate*\n\n*Enter a rate greater than the current one*",
  RATE_MUST_BE_LESS:
    "Current rate value: *currentRate*\nYou sent: *userRate*\n\n*Enter a rate less than the current one*",
  TEMPLATE_CREATED_MORE_THAN:
    "Template *More than* has been created\n\nI will send you a notification when the *direction* rate value is greater than or equal to *userRate*.",
  TEMPLATE_CREATED_LESS_THAN:
    "Template *Less then* has been created\n\nI will send you a notification when the *direction* rate value is less than or equal to *userRate*.",
  NOTIFY_MORE_THAN:
    "🔔 Template *More than* has been completed 🔔\n\n*direction* rate has reached *userRate* and is now *currentRate*",
  NOTIFY_LESS_THAN:
    "🔔 Template *Less than* has been completed 🔔\n\n*direction* rate has reached *userRate* and is now *currentRate*",
  YOU_HAVE_COUNT_TEMPLATES: "Number of active templates: *count*\n\n",
  TEMPLATE_DESC:
    "*ID:* identifier\n*Template:* templateType\n*Direction*: direction\n*Rate value*: rateValue\n\n",

  LANG_CHANGED: "Language has been changed",

  moreThan: "More than",
  lessThan: "Less than",
  tracking: "Tracking",

  TEMPLATE_CREATED_TRACKING:
    "Template *Tracking* has been created\n\nI will send you a notification when the *direction* rate changes to *userRate*.",
  NOTIFY_TRACKING:
    "🔔 Шаблон *Трекинг* сработал 🔔\n\nКурс *direction* изменился на *userRate* и сейчас составляет *currentRate*",
  SETTINGS: "Settings",
  CHOOSE_NEW_LANG: "🇺🇸🇷🇺 Choose new language",

  TRACKING_RECOMMENDED_AMOUNT:
    "*Рекомендую использовать значение близкое к 10%:* recommendedAmount",

  MAIN_MENU: "Главное меню",

  botDesc: `🇷🇺 Бот создан для отслеживания значений курсов криптовалют с крипто биржи Бинансе.
  ✅ Вы можете создать шаблон, при срабатывании которого Вы будете получите уведомление.
  
  🇺🇸 The bot was created to track the values of cryptocurrency rates from the Binance crypto exchange.
  ✅You can create a template, when triggered, you will receive a notification.`,
};

module.exports = {
  CREATE_TEMPLATE: "Create a template to receive notification ⬇️",
  CANT_UNDERSTAND: "I don't understand you 🤨",
  HAVENT_TEMPLATES: "You don't have templates yet 😢",
  CHOOSE_TEMPLATE_TYPE:
    "*Choose a template: *\n\n*🔼 Greater than:* I'll send you a notification when the value of the specified rate is greater than or equal to the entered value(target)\n(_Template will be deleted after triggering_)\n\n*🔽 Less than :* I will send you a notification when the value of the specified rate is less than or equal to the entered value (target)\n(_Template will be deleted after triggering_)\n\n*📈 Tracking:* I will send you notifications when the value of the course changes to the entered value( change value - CV).\nExample: the current BTC/USDT rate is 40000; You entered CV=1000; You will receive a notification as soon as the rate is equal to ...39000, 40000, 41000, 42000...",
  MORE_THAN_CALLBACK: "More than 🔼",
  LESS_THAN_CALLBACK: "Less than 🔽",
  TRACKING_CALLBACK: "Tracking 📈",
  SEND_DIRECTION:
    "*Select a rate from the most popular ones or enter it yourself in the following form:*\n\nBTC/USDT\nbtc/usdt\nBTCUSDT\nbtcusdt",
  DIRECTION_INVALID: "*Can't find this direction☹️*\nTry another one",
  SEND_RATE_MORE_THAN:
    "Enter the rate above which I will send you a notification.\n*Current rate:*",
  SEND_RATE_LESS_THAN:
    "Enter the rate that I'll send you a notification when it goes down.\n*Current rate:*",
  SEND_RATE_TRACKING:
    "Enter the amount of change *(CV)* of the course, when changing *TO(+ or -)* which I will send you a notification\n\n*Current rate:*",
  TEMPLATE_CREATED: "✅ *Template created*",
  ONLY_NUMBERS: "Enter only numbers and delimiters: *, .*",
  RATE_MUST_BE_MORE:
    "Current rate: *currentRate*\nYou entered: *userRate*\n\n*Enter a rate greater than the current one*",
  RATE_MUST_BE_LESS:
    "Current rate: *currentRate*\nYou entered: *userRate*\n\n*Enter a rate lower than the current one*",
  TEMPLATE_CREATED_MORE_THAN:
    "✅ Template *Greater than* created\n\nI will send you a notification when the *direction* rate is greater than or equal to *userRate*.",
  TEMPLATE_CREATED_LESS_THAN:
    "✅ Template *Less than* created\n\nI will send you a notification when the *direction* rate is less than or equal to *userRate*.",
  TEMPLATE_CREATED_TRACKING:
    "✅ The *Tracking* template has been created\n\nI will send you a notification when the *direction* rate changes to *CV userRate*.",
  NOTIFY_MORE_THAN:
    "🔔 Pattern *Greater than* triggered 🔔\n\nDirection *direction* reached *userRate* and is now *currentRate*",
  NOTIFY_LESS_THAN:
    "🔔 Pattern *Less Than* triggered 🔔\n\nDirection *direction* reached *userRate* and is now *currentRate*",
  NOTIFY_TRACKING:
    "🔔 The *Tracking* template triggered 🔔\n\nThe *direction* rate changed to *userRate* and is now *currentRate*",
  YOU_HAVE_COUNT_TEMPLATES: "Number of active templates: *count*\n\n",
  TEMPLATE_DESC_MORE_THAN:
    "*ID:* identifier\n*Template:* templateType\n*Rate:* direction\n*Target*: ≥ rateValue\n\n",
  TEMPLATE_DESC_LESS_THAN:
    "*ID:* identifier\n*Template:* templateType\n*Rate:* direction\n*Target:* ≤ rateValue\n\n",
  TEMPLATE_DESC_TRACKING:
    "*ID:* identifier\n*Template:* templateType\n*Rate*: direction\n*Current rate value:* currentRate\n*Last commit:* lastRate\n*CV*: rateValue\n\n",
  SETTINGS: "Settings",
  CHOOSE_NEW_LANG: "🇺🇸🇷🇺 Choose a language",
  LANG_CHANGED: "Language changed",

  moreThan: "More than",
  lessThan: "Less than",
  tracking: "Tracking",

  TRACKING_RECOMMENDED_AMOUNT:
    "*I recommend using a value close to 10%:* recommendedAmount",

  SELECT_TEMPLATE_ID:
    "*Select the template ID to delete.*\n\n❓ The template ID can be found by clicking *My Templates* in the menu",
  TEMPLATE_NOT_FOUND:
    "⛔️ *Template with this ID was not found! It may have already been deleted*",
  TEMPLATE_WAS_DELETED: "✅ Template deleted successfully",
  ENTER_DONATE_AMOUNT:
    "Enter the amount in *USD💲* so I can generate a payment request 🙂",
  DONATE_TOO_SMALL:
    "The payment system does not allow too small amounts, sorry 😢",
  DONATE_TOO_BIG:
    "Im glad that you are such a generous person, but the payment system will not miss this payment 😢",
  DONATE_FINISH_STEP:
    "Click on the *button below* to proceed to the payment 🙂\n\n*Thank you for your support*",
  PAY: "Pay",
  DONATE_GENERATE_REQ: "Generating a link...",

  MAIN_MENU: "Main Menu",
};
