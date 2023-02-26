const User = require("../domain/User");

const wrapDatabase =
  (database, fn) =>
  (...args) =>
    fn(...args);
const wrapDomain = (domain, database) =>
  Object.entries(domain).map((fn) => wrapDatabase(database, fn));

class Domain {
  constructor(database) {
    this.user = wrapDomain(User, database);
  }
}

module.exports = Domain;
