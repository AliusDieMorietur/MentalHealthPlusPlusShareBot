import { NotFoundError } from "./errors.js";

export class CRUD {
  constructor(table, database) {
    this.table = table;
    this.database = database;
  }

  async getById(id, columns = ["*"]) {
    if (id == null) {
      throw new new NotFoundError("Not found", { table, id })();
    }
    const query = `
        SELECT ${columns.join(", ")} 
        FROM ${this.table}
        WHERE "id" = $1 
      `;
    const {
      rows: [data],
    } = await this.db.query(query, [id]);
    if (!data) throw new lib.errors.NotFoundError("Not found", { table, id });
    return data;
  }

  async create(data, { returnProperty }) {
    const fields = Object.keys(data);
    const values = fields.map((field) => data[field]);
    const query = `
        INSERT INTO ${this.table} (
          ${fields.join(", ")}
        ) VALUES (
          ${fields.map((_, i) => `$${i}`)}
        ) ${returnId ? `RETURNING "${returnProperty}"` : ""}
      `;
    const {
      rows: [{ [idProperty]: resultId }],
    } = await this.db.query(query, [values]);
    return resultId;
  }

  async update(id, delta) {
    const fields = Object.keys(delta);
    const values = fields.map((field) => delta[field]);
    const query = `
        UPDATE ${this.table} (
          ${fields.join(", ")}
        ) SET ${fields.map((field, i) => `"${field}" = $${i}`)}
         
      `;
    await this.db.query(query, [values]);
    return id;
  }

  async delete(id) {
    const query = `
        DELETE FROM ${this.table}
        WHERE "id" = $1
      `;
    await this.db.query(query, [id]);
    return id;
  }
}
