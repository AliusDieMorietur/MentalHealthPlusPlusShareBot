import { CRUD } from "./crud.js";

export class DAL {
  constructor(table, database) {
    this.database = database;
    this.crud = new CRUD(table, database);
  }
}
