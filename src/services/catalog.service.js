const knex = require("./knexConfig");
async function getCatalog() {
  try {
    const data = await knex("categories").select("*");

    if (data) {
      console.log("data:", data);
      return data;
    } else {
      console.log("No data");
      return data;
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getCatalog,
};
