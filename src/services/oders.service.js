// create user with JSON
const knex = require("./knexConfig");

async function oderProducts(usernameData, orderData, invoiceData) {
  let transaction;

  const user = await knex("users")
    .select("users.*")
    .where("username", usernameData)
    .first();
  try {
    transaction = await knex.transaction();

    orderData.UserID = user.UserID;
    const [orderID] = await transaction("orders").insert(orderData);
    invoiceData.orderID = orderID;

    await transaction("invoices").insert(invoiceData);

    console.log("pending oder", [[orderData, invoiceData]]);
    await transaction.commit();

    return {
      orderData,
      invoiceData,
    };
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    throw error;
  }
}
module.exports = {
  oderProducts,
};
