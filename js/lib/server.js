const http = require("node:http");
const https = require("node:https");
const { safeParseJSON } = require("../utils/safeParseJSON");

class Server {
  constructor({ port, hostname, protocol }, channelManager) {
    this.port = port;
    this.hostname = hostname;
    this.protocol = protocol;
    this.channelManager = channelManager;
    // TODO: implement protocol independent server
    this.server = http.createServer((req, res) => {
      req.on("data", (buffer) => {
        const bufferStringified = buffer.toString();
        const data = safeParseJSON(bufferStringified, null);
        if (!data) return;
        this.channelManager.handle(req.url, data);
      });
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ status: "ok" }));
    });
  }

  start() {
    this.server.listen(this.port, this.hostname, () => {
      console.log(
        `Server running at ${this.protocol}://${this.hostname}:${this.port}/`
      );
    });
  }
}

module.exports = Server;
