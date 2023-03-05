import fastify from "fastify";
import http from "node:http";
import { safeParseJSON } from "../utils/safeParseJSON.js";

export class Server {
  constructor({ port, hostname, protocol }, channelManager) {
    this.port = port;
    this.hostname = hostname;
    this.protocol = protocol;
    this.channelManager = channelManager;
    // TODO: implement protocol independent server
    // this.server = fastify({
    //   logger: false,
    // });

    // this.server.route({
    //   method: "GET",
    //   url: "/",
    //   handler: async (request, reply) => {
    //     return { hello: "world" };
    //   },
    // });

    // this.server.route({
    //   method: "POST",
    //   url: "/api/hook/:token",
    //   handler: async (request, reply) => {
    //     this.channelManager.handle(request.url, request.body);
    //     reply.statusCode = 200;
    //     reply.setHeader("Content-Type", "application/json");
    //     return { status: "ok" };
    //   },
    // });

    // node variant
    this.server = http.createServer((req, res) => {
      req.on("data", (buffer) => {
        const bufferStringified = buffer.toString();
        const data = safeParseJSON(bufferStringified, null);
        if (!data) return;
        console.log("data", data);
        this.channelManager.handle(req.url, data);
      });
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ status: "ok" }));
    });
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
