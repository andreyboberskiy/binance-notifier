const appConfig = require("../configs/appConfig");
const Analytic = require("../Analytic");

const WS = require("websocket").client;

class BinanceObserver {
  constructor() {
    this.listeners = [];
  }

  async init() {
    const ws = await new WS();

    ws.connect(appConfig.binanceSocketUrl);

    ws.on("connect", (connection) => {
      console.log("Socket connected");
      Analytic.send("SOCKET CONNECTED", "APP");

      connection.on("close", (data) => {
        console.log("Socket connection has been closed", data);
        Analytic.send("Socket connection has been closed", "APP", data);

        setTimeout(() => {
          this.init().bind(this);
        }, 1000);
      });
      connection.on("error", (err) => {
        console.log("Error with Socket connection", err);
        Analytic.send("Error with Socket connection", "APP", err);
        ws.close();
      });

      connection.on("message", (message) => {
        let parsedData = JSON.parse(message.utf8Data);

        if (parsedData?.data) {
          parsedData = parsedData.data;

          parsedData = parsedData.map((data) => ({
            timestamp: data.E,
            direction: data.s,
            rate: Number(data.c),
          }));
          this.broadcast(parsedData);
        }
      });

      connection.send(
        JSON.stringify({
          id: 2,
          method: "SUBSCRIBE",
          params: ["!miniTicker@arr@3000ms"],
        })
      );
    });
  }

  broadcast(data) {
    this.listeners.forEach((listener) => {
      listener(data);
    });
  }

  listen(listener) {
    if (listener) {
      this.listeners.push(listener);
    }
  }
}

const observer = new BinanceObserver();
module.exports = observer;
