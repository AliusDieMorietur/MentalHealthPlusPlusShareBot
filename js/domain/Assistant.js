import { ChannelStateDAL } from "../dal/ChannelState.js";
import { EventEmitter } from "node:events";

export class Assistant {
  constructor(database) {
    this.events = new EventEmitter();
    this.events.on("message", this.handleMessage);
    // this.dal = new ChannelStateDAL(database);
  }

  async handleMessage(state) {
    console.log("state", state);
  }
}
