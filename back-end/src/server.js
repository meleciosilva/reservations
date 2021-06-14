const { PORT = 5000, NODE_ENV = "development" } = process.env;

const app = require("./app");
const knex = require("./db/connection");

knex.migrate
  .latest()
  .then((migrations) => {
    console.log("migrations", migrations);
  })
  .then(() => {
    if (NODE_ENV === "production") {
      return knex.seed.run()
    }
  })
  .then(() => app.listen(PORT, listener))
  .catch((error) => {
    console.error(error);
    knex.destroy();
  });

function listener() {
  console.log(`Listening on Port ${PORT}!`);
}
