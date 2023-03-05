import pg from "pg";
const { Pool } = pg;

export class Database {
  static instance = null;

  constructor(config) {
    this.config = config;
  }

  async start() {
    this.pool = new Pool(this.config);
    return this.query("SELECT NOW()");
  }

  async query(query, args) {
    const client = await this.pool.connect();
    const data = await client.query(query, args);
    client.release();
    return data;
  }

  getInstance() {
    if (!this.instance) throw new Error("Database not set up");
    return this.instance || (instance = createInstance());
  }
}
