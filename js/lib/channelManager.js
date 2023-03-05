import { TelegramChannel } from "./telegram/channel.js";

export class ChannelManager {
  constructor(channels, channelConfig, channelStateDomain) {
    this.channels = {};
    this.channelConfig = channelConfig;
    this.channelStateDomain = channelStateDomain;
    this.load(channels);
  }

  updateServerUrl(serverUrl) {
    this.channelConfig.serverUrl = serverUrl;
    const channels = Object.keys(this.channels);
    for (const channel of channels) {
      this.channels[channel].updateServerUrl(serverUrl);
    }
  }

  start() {
    const channels = Object.values(this.channels);
    for (const channel of channels) {
      channel.start();
    }
  }

  load(channels) {
    for (const channel of channels) {
      this.add(channel);
    }
  }

  handle(method, data) {
    const channels = Object.values(this.channels);
    for (const channel of channels) {
      if (channel.canHandle(method)) {
        channel.handle(method, data);
        break;
      }
    }
  }

  add({ name, config }) {
    if (name === "telegram" && config.token) {
      this.channels[name] = new TelegramChannel(
        {
          ...this.channelConfig,
          ...config,
        },
        this.channelStateDomain
      );
    }
  }
}
