const { Pool } = require("pg");

class Database {
  static instance = null;

  constructor(config) {
    this.config = config;
  }

  start() {
    this.pool = new Pool(config);
    this.query("SELECT NOW()");
  }

  async query(query, args) {
    const client = await this.pool.connect();
    await client.query(query, args);
    client.release();
  }

  getInstance() {
    if (!this.instance) throw new Error("Database not set up");
    return this.instance || (instance = createInstance());
  }
}

module.exports = Database;
