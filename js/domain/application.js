const ngrok = require("ngrok");
const ChannelManager = require("../lib/channelManager");
const Server = require("../lib/server");

class Application {
  constructor(config = {}) {
    this.config = config;
  }

  async start() {
    const { channel, channels, server } = this.config;
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
      console.log({ url }, "ngrok tunnel started");
      this.config.channel.serverUrl = url;
      this.channelManager.updateServerUrl(url);
      this.config.channel.serverUrlIsGenerated = true;
    }
    this.server.start();
    this.channelManager.start();
  }
}

module.exports = Application;
