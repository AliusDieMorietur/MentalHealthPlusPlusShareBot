const create = require("./create");
const deleteUser = require("./delete");
const get = require("./get");
const update = require("./update");

module.exports = {
  create,
  get,
  update,
  delete: deleteUser,
};
