const knex = require("./../db/connection");

function list() {
  return knex("reservations as r")
    .select("*")
    .orderBy("r.reservation_time", "r.reservation_date");
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

function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

module.exports = {
  list,
  read,
  create,
  update,
  destroy,
  search,
}