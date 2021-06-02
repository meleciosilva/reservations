const knex = require("./../db/connection");

function list() {
  return knex("reservations")
    .select("*");
}

function read(reservationId) {
  return knex("reservations as r")
    .select("*")
    .where({ "r.reservation_id": reservationId })
    .first();
}

function create(newReservation) {
  return knex("reservations as r")
    .insert(newReservation)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function update(updatedReservation) {
  return knex("reservations as r")
    .select("*")
    .where({ "r.reservation_id": updatedReservation.reservation_id })
    .update(updatedReservation, "*")
  }

function destroy(reservation_id) {
  return knex("reservations as r")
    .where({ reservation_id })
    .del();
}

module.exports = {
  list,
  read,
  create,
  update,
  destroy
}