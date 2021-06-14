const reservations = require("./../reservations");

exports.seed = function (knex) {
  return knex("reservations").insert(reservations);
};
