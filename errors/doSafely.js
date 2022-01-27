const Analytic = require("../Analytic");

module.exports = (func) => {
  try {
    return func();
  } catch (e) {
    console.log("HANDLED ERROR ", e);
    Analytic.send("Error", "SYSTEM", { error: e });
  }
};
