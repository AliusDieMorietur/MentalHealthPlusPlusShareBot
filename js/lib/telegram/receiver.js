import { MediaKind } from "../media.js";

export class TelegramReceiver extends Receiver {
  canHandle(method, token) {
    return token && method.includes(token);
  }

  async mapReceivedMessageToMedia(message) {
    const { caption } = message;
    if (message.contact) {
      const { contact } = message;
      return {
        kind: MediaKind.CONTACT,
        data: {
          phone: message.contact.phone_number,
          accountName: contact.first_name,
        },
      };
    }
    if (message.photo) {
      const { file_id: fileId } = message.photo[message.photo.length - 1] ?? {};
      return { kind: MediaKind.IMAGE, data: { fileId, text: caption } };
    }
    if (message?.video) {
      const { file_id: fileId } = message.video;
      return { kind: MediaKind.VIDEO, data: { fileId, text: caption } };
    }
    if (message.text) {
      return { kind: MediaKind.TEXT, data: { text: message.text } };
    }
    throw new ChannelError("UNKNOWN_MESSAGE", {
      channel: this.kind,
      channelId: this.id,
      status: ChannelStateStatus.FAILED,
    });
  }

  async handleMessage(message) {
    const channelId = String(message.chat.id);
    const dateTime = new Date(message.date);
    const messageId = String(message.message_id);
    const mediaItem = await this.mapReceivedMessageToMedia(message);
    const channelState = await this.channelStateDomain.getCurrent(context, {
      channelId,
      channel: this.kind,
    });
    const name = message.from?.first_name;
    const channelMessageBase = {
      kind: ChannelMessageKind.MESSAGE,
      channel: this.kind,
      sender: { channelId, accountId: channelState?.accountId },
      mediaItem,
      source: channelState?.media,
      messageInfo: {
        dateTime,
        language: this.extractSenderLanguage(message.from),
        messageId,
        name,
      },
    };

    if (mediaItem.kind !== MediaKind.TEXT || !channelState) {
      return channelMessageBase;
    }

    const lastMediaItemKeyboard =
      channelState.media[channelState.media.length - 1]?.keyboard;

    if (
      !lastMediaItemKeyboard ||
      lastMediaItemKeyboard.kind !== MediaKeyboardKind.REPLY
    ) {
      return channelMessageBase;
    }

    const button = lastMediaItemKeyboard.rows
      .flat()
      .find(({ label }) => label === mediaItem.data.text);

    if (!button || button.kind !== MediaButtonKind.REPLY)
      return channelMessageBase;

    const buttonMediaItem = {
      kind: MediaKind.TEXT,
      data: { text: button.value },
    };

    return {
      ...channelMessageBase,
      mediaItem: buttonMediaItem,
    };
  }
}
