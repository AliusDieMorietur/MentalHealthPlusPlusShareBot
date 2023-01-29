const Channel = require("./channel");
const { fetch, fetchJSON } = require("./http");
const Receiver = require("./receiver");
const Sender = require("./sender");

class TelegramReceiver extends Receiver {
  canHandle(method, token) {
    return token && method.includes(token);
  }

  parseMessage({ message }) {
    const chatId = message.chat.id;
    const { text, photo } = message;

    console.log("text, photo", text, photo);
    console.log("message", message);
  }
}

class TelegramSender extends Sender {
  prepareMessage(data) {
    console.log("data", data);
  }

  send(data) {
    console.log("data", data);
  }
}

class TelegramChannel extends Channel {
  constructor(config) {
    super(config);
    this.receiver = new TelegramReceiver(config);
    this.sender = new TelegramSender(config);
  }

  async start() {
    this.setHook(this.config);
  }

  // async getMe() {
  //   const { token, apiUrl, timeout } = this.config;

  //   const botUrl = `${apiUrl}${token}`;
  //   const getMe = `${botUrl}/getMe`;

  //   console.log("botURL", botUrl);

  //   const res = await fetchJSON(getMe, { timeout });
  //   console.log("res", res);
  // }

  handle(method, data) {
    this.parseMessage(data);
  }

  async setHook() {
    const { token, apiUrl, serverUrl } = this.config;
    if (!token) return;
    const headers = {
      "Content-Type": "application/json",
    };
    const method = "POST";
    const url = `${apiUrl}${token}/setWebhook?url=${serverUrl}/api/hook/${token}`;

    console.log({ url }, "Setting telegram hook");
    const { data, statusCode } = await fetch(url, { headers, method });
    console.log({ statusCode, data }, `Telegram  hook set`);
  }
}

module.exports = TelegramChannel;
