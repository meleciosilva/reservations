const knex = require("../db/connection");

function list() {
  return knex("tables as t").select("*").orderBy("t.table_name");
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
    .update(updatedTable)
    .returning("*")
    .then((updatedRecords) => updatedRecords[0]);
}

function destroy(tableId) {
  return knex("tables as t").where({ "t.table_id": tableId }).del();
}

function readReservation(reservationId) {
  return knex("reservations as r")
    .select("*")
    .where({ "r.reservation_id": reservationId })
    .first();
}

function deleteTableAndUpdateReservation(table, reservationId) {
  return knex.transaction((trx) => {
    return trx("tables as t")
      .where({ "t.table_id": table.table_id })
      .del()
      .then(() => trx.insert(table).into("tables"))
      .then(() => {
        return trx("reservations as r")
          .select("*")
          .where({ "r.reservation_id": reservationId })
          .first();
      })
      .then((reservation) => {
        reservation.status = "finished";
        return reservation;
      })
      .then((updatedReservation) => {
        return trx("reservations as r")
          .select("*")
          .where({ "r.reservation_id": updatedReservation.reservation_id })
          .update(updatedReservation);
      });
  });
}

function updateTableAndReservationStatus(updatedTable, updatedReservation) {
  return knex.transaction((trx) => {
    return trx("tables as t")
      .select("*")
      .where({ "t.table_id": updatedTable.table_id })
      .update(updatedTable)
      .then(() => {
        return knex("reservations as r")
          .select("*")
          .where({ "r.reservation_id": updatedReservation.reservation_id })
          .update(updatedReservation)
          .returning("*")
          .then((updatedRecords) => updatedRecords[0]);
      });
  });
}

module.exports = {
  list,
  create,
  read,
  update,
  destroy,
  readReservation,
  deleteTableAndUpdateReservation,
  updateTableAndReservationStatus,
};
