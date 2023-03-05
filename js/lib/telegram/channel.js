import { Channel } from "../channel.js";
import { fetch } from "../http.js";
import { MediaKind } from "../media.js";
import { Receiver } from "../receiver.js";
import { Sender } from "../sender.js";

export class TelegramChannel extends Channel {
  constructor(config) {
    super(config);
    this.receiver = new TelegramReceiver(config);
    this.sender = new TelegramSender(config);
    this.startCommand = "/start";
  }

  async start() {
    this.setHook(this.config);
  }

  async handle({
    args: {
      message,
      callback_query: callbackQuery,
      my_chat_member: myChatMember,
      chat_member: chatMember,
    },
  }) {
    if (myChatMember) {
      return this.handleChatMemberUpdate(myChatMember);
    }

    if (callbackQuery) {
      return this.handleCallbackQuery(callbackQuery);
    }

    if (!message) return null;

    const channelMessage = await this.handleMessage(message);

    const { mediaItem } = channelMessage;

    if (mediaItem.kind !== MediaKind.TEXT) return channelMessage;

    if (!mediaItem.data.text.startsWith(this.startCommand))
      return channelMessage;

    const [command, payload] = mediaItem.data.text
      .split(" ")
      .map((str) => str.trim());
    mediaItem.data.text = command;
    const messageContext = payload;

    return {
      ...channelMessage,
      mediaItem,
      context: messageContext,
    };
  }

  async handleChatMemberUpdate(chatMemberUpdate) {
    const {
      old_chat_member: { status: oldStatus },
      new_chat_member: { user, status: newStatus },
      date,
    } = chatMemberUpdate;
    if (user.username === this.username) return null;
    const channelId = String(user.id);
    const channelState = await this.channelStateDomain.getCurrent(context, {
      channel: this.kind,
      channelId,
    });
    const dateTime = new Date(date);
    const { first_name: name, last_name: surname } = user;
    const channelActivityBase = {
      channel: this.kind,
      sender: { channelId, accountId: channelState?.accountId },
      messageInfo: {
        dateTime,
        name,
        surname,
        language: this.extractSenderLanguage(user),
      },
    };
    if (newStatus === "kicked") {
      return {
        ...channelActivityBase,
        kind: ChannelMessageKind.BLOCKED,
      };
    }
    if (oldStatus === "kicked" && newStatus !== "kicked") {
      return {
        ...channelActivityBase,
        kind: ChannelMessageKind.SUBSCRIBED,
      };
    }
    return null;
  }

  async handleCallbackQuery(callbackQuery) {
    const messageId = String(callbackQuery.id);
    const channelId = String(callbackQuery.from.id);
    const name = callbackQuery.from.first_name;
    const dateTime = new Date();
    const channelState = await this.channelStateDomain.getCurrent(context, {
      channelId,
      channel: this.kind,
    });
    const mediaItem = {
      kind: MediaKind.TEXT,
      data: { text: callbackQuery.data ?? "" },
    };

    await this.answerCallback(callbackQuery.id);

    return {
      channel: this.kind,
      mediaItem,
      sender: { channelId, accountId: channelState?.accountId },
      source: channelState?.media,
      messageInfo: {
        name,
        dateTime,
        messageId,
        language: this.extractSenderLanguage(callbackQuery.from),
      },
    };
  }

  async setHook() {
    const { token, apiUrl, serverUrl } = this.config;
    if (!token) return;
    const headers = {
      "Content-Type": "application/json",
    };
    const method = "POST";
    const url = `${apiUrl}${token}/setWebhook?url=${serverUrl}/api/hook/${token}`;

    console.log("Setting telegram hook", { url });
    const { data, statusCode } = await fetch(url, { headers, method });
    console.log({ statusCode, data }, `Telegram  hook set`);
  }
}
