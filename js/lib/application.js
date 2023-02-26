const ngrok = require("ngrok");
const ChannelManager = require("./channelManager");
const Database = require("./database");
const Server = require("./server");
const Domain = require("./domain");

class Application {
  constructor(config = {}) {
    this.config = config;
  }

  async start() {
    console.log("domain", domain);
    const { channel, channels, server, database } = this.config;
    this.channelManager = new ChannelManager(channels, channel);
    this.server = new Server(server, this.channelManager);
    this.database = new Database(database);
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
  }
}

module.exports = Application;
