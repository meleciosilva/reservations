const knex = require("../db/connection");

function list() {
  return knex("tables as t")
    .select("*")
    .orderBy("t.table_name")
}

function create(newTable) {
  return knex("tables")
    .insert(newTable)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function read(tableId) {
  return knex("tables as t")
    .select("*")
    .where({ "t.table_id": tableId })
    .first();
}

function update(updatedTable) {
  return knex("tables as t")
    .select("*")  
    .where({ "t.table_id": updatedTable.table_id })
    .update(updatedTable, "*");
}

module.exports = {
  list,
  create,
  read,
  update
}