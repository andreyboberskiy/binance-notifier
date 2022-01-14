class RateCache {
  rates = {};
  constructor() {
    this.rates = {};
  }

  subscriber = (data) => {
    const mappedRates = data.reduce((acc, currValue) => {
      const newAcc = { ...acc };
      newAcc[currValue.direction] = currValue.rate;
      return newAcc;
    }, {});
    const currentRates = this.rates;
    this.rates = { ...currentRates, ...mappedRates };
  };
}

module.exports = new RateCache();
