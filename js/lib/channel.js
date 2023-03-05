import { Receiver } from "./receiver.js";
import { Sender } from "./sender.js";

export class Channel {
  constructor(config, channelStateDomain) {
    this.config = config;
    this.channelStateDomain = channelStateDomain;
    this.receiver = new Receiver(config, channelStateDomain);
    this.sender = new Sender(config, channelStateDomain);
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

  handleMessage(...args) {
    return this.receiver.handleMessage(...args);
  }

  prepareMessage(...args) {
    return this.sender.prepareMessage(...args);
  }

  send(...args) {
    return this.sender.prepareMessage(...args);
  }
}
