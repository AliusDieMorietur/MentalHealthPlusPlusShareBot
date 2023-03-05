export class Sender {
  constructor(config, channelStateDomain) {
    this.config = config;
    this.channelStateDomain = channelStateDomain;
  }

  prepareMessage() {
    throw new Error("prepare is not implemented");
  }

  send() {
    throw new Error("send is not implemented");
  }
}
