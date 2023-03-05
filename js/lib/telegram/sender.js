export class TelegramSender extends Sender {
  prepareMessage(data) {
    console.log("data", data);
  }

  send(data) {
    console.log("data", data);
  }
}
