require("dotenv").config();
const { DB_HOST, DB_PORT, DB_USER, DB_NAME } = process.env;
const knex = require("knex")({
  client: "mysql",
  connection: {
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    database: DB_NAME,
  },
});

// check connect
async function checkconnection() {
  try {
    // Sử dụng hàm connect của knex để thử kết nối
    await knex.raw("SELECT 1");
    console.log(
      `Connection to database successfully! with database name: ${DB_NAME}`
    );
    return true;
  } catch (error) {
    console.error("Error while connectting database ", error);
    return false;
  }
}

module.exports = {
  knex,
  checkconnection,
};
