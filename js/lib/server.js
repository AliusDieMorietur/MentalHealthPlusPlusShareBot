const fastify = require("fastify");
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
    this.server = fastify({
      logger: false,
    });

    this.server.route({
      method: "POST",
      url: "/",
      handler: async (request, reply) => {
        return { hello: "world" };
      },
    });

    this.server.route({
      method: "POST",
      url: "/api/hook/:token",
      handler: async (request, reply) => {
        this.channelManager.handle(request.url, request.body);
        reply.statusCode = 200;
        reply.setHeader("Content-Type", "application/json");
        return { status: "ok" };
      },
    });

    // node variant
    // this.server = http.createServer((req, res) => {
    //   req.on("data", (buffer) => {
    //     console.log("req", req);
    //     const bufferStringified = buffer.toString();
    //     const data = safeParseJSON(bufferStringified, null);
    //     if (!data) return;
    //     this.channelManager.handle(req.url, data);
    //   });
    //   res.statusCode = 200;
    //   res.setHeader("Content-Type", "application/json");
    //   res.end(JSON.stringify({ status: "ok" }));
    // });
  }

  start() {
    this.server.listen(
      { port: this.port, host: this.hostname },
      (err, address) => {
        console.log("address", address);
        if (err) {
          console.log("err", err);
          // fastify.log.error(err);
        }
        console.log(
          `Server running at ${this.protocol}://${this.hostname}:${this.port}/`
        );
      }
    );
  }
}

module.exports = Server;
