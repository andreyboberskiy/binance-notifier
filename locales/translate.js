const en = require("./en.js");
const ru = require("./ru.js");

module.exports = (key, lang = "en", vars) => {
  let translatedText = null;

  switch (lang) {
    case "ru": {
      translatedText = ru[key];
      break;
    }
    case "en": {
      translatedText = en[key];
      break;
    }
    default: {
      translatedText = key;
    }
  }

  if (vars && translatedText) {
    Object.entries(vars).forEach(([key, value]) => {
      translatedText = translatedText.replace(key, value);
    });
  }

  return translatedText || key;
};
