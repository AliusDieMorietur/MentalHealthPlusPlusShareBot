class Receiver {
  constructor(config) {
    this.config = config;
  }

  canHandle() {
    throw new Error("canHandle is not implemented");
  }

  parseMessage() {
    throw new Error("parseMessage is not implemented");
  }
}

module.exports = Receiver;
