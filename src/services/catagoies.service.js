const knex = require("./knexConfig");

// getall
async function getAll() {
  try {
    const Data = await knex("categories").select("categories.*");
    console.log("Get  all data from the database", Data);
    return Data;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAll,
};
