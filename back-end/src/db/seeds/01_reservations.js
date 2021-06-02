const reservations = require("./../reservations");

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('reservations').del()
    .then(() => {
      // Inserts seed entries
      return knex('reservations').insert(reservations);
    });
};
