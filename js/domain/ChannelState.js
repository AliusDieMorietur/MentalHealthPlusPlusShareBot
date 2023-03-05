import { ChannelStateDAL } from "../dal/ChannelState.js";

export class ChannelState {
  constructor(database) {
    this.dal = new ChannelStateDAL(database);
  }

  async set(state) {
    return this.dal.create(state);
  }

  async getCurrent() {
    return this.dal.getCurrent();
  }
}
