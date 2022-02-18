const mixpanel = require("mixpanel");
const appConfig = require("../configs/appConfig");

class Analytic {
  instance;
  init() {
    this.instance = mixpanel.init(appConfig.mixPanelToken, {
      debug: appConfig.isDev,
    });
  }
  send(eventName, id, options = {}) {
    if (this.instance) {
      this.instance.track(eventName, {
        unique_id: id,
        distinct_id: id,
        ...options,
      });
    }
  }
}

module.exports = new Analytic();
