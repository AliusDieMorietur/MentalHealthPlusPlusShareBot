import ngrok from "ngrok";
import { ChannelManager } from "./channelManager.js";
import { Database } from "./database.js";
import { Server } from "./server.js";
import { initDomain } from "../domain/index.js";
import { migrateUp } from "./migration.js";

export class Application {
  constructor(config = {}) {
    this.config = config;
  }

  async start() {
    const { channel, channels, server, database } = this.config;
    this.database = new Database(database);
    this.domain = initDomain(database);
    this.channelManager = new ChannelManager(channels, channel);
    this.server = new Server(server, this.channelManager);
    if (!this.config.channel.serverUrl) {
      console.log("Starting ngrok");
      const options = {
        addr: this.config.server.port,
        region: "eu",
      };
      const url = await ngrok.connect(options).catch((err) => {
        console.error({ err }, "Cannot connect ngrok");
        throw err;
      });
      console.log("ngrok tunnel started at", { url });
      this.config.channel.serverUrl = url;
      this.channelManager.updateServerUrl(url);
      this.config.channel.serverUrlIsGenerated = true;
    }
    this.server.start();
    this.channelManager.start();
    const {
      rows: [{ now }],
    } = await this.database.start();
    console.log(`Database connected: ${now}`);
    migrateUp(database);
  }
}
