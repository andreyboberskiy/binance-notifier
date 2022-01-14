module.exports = (func) => {
  try {
    return func();
  } catch (e) {
    console.log("HANDLED ERROR ", e);
  }
};
