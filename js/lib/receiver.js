export class Receiver {
  constructor(config, channelStateDomain) {
    this.config = config;
    this.channelStateDomain = channelStateDomain;
  }

  canHandle() {
    throw new Error("canHandle is not implemented");
  }

  parseMessage() {
    throw new Error("parseMessage is not implemented");
  }
}
