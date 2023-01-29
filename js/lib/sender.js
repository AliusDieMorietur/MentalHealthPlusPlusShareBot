class Sender {
  constructor(config) {
    this.config = config;
  }

  prepareMessage() {
    throw new Error("prepare is not implemented");
  }

  send() {
    throw new Error("send is not implemented");
  }
}

module.exports = Sender;
