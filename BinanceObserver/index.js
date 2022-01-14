const appConfig = require("../configs/appConfig");

const WS = require("websocket").client;

class BinanceObserver {
  constructor() {
    this.listeners = [];
  }

  async init() {
    const ws = await new WS();

    ws.connect(appConfig.binanceSocketUrl);

    ws.on("connect", (connection) => {
      console.log('Socket connected')

      connection.on("close", (data) => {
        console.log("Socket connection has been closed", data);
      });
      connection.on("error", (err) => {
        console.log("Error with Socket connection", err);
      });




      connection.on("message", (message) => {
        let parsedData = JSON.parse(message.utf8Data);

        if (parsedData?.data) {
          parsedData = parsedData.data;

          parsedData = parsedData.map((data) => ({
            timestamp: data.E,
            direction: data.s,
            rate: data.c,
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
