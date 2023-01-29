const Receiver = require("./receiver");
const Sender = require("./sender");

class Channel {
  constructor(config) {
    this.config = config;
    this.receiver = new Receiver(config);
    this.sender = new Sender(config);
  }

  async start() {
    throw new Error("Start is not implemented");
  }

  handle() {
    throw new Error("Handle is not implemented");
  }

  updateServerUrl(serverUrl) {
    this.config.serverUrl = serverUrl;
  }

  canHandle(method) {
    return this.receiver.canHandle(method, this.config.token);
  }

  parseMessage(...args) {
    return this.receiver.parseMessage(...args);
  }

  prepareMessage(...args) {
    return this.sender.prepareMessage(...args);
  }

  send(...args) {
    return this.sender.prepareMessage(...args);
  }
}

module.exports = Channel;
