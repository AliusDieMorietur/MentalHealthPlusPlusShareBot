import { DAL } from "../../lib/dal";

export class ChannelStateDAL extends DAL {
  constructor(database) {
    super("ActivityHistory", database);
  }

  async create(state, options) {
    return this.crud.create(state, options);
  }

  async getCurrent() {
    const {
      rows: [current],
    } = await this.database.query(
      `
      SELECT * 
      FROM "ActivityHistory"
      ORDER BY "createdAt" DESC
      LIMIT 1
      `
    );
    return current;
  }
}
