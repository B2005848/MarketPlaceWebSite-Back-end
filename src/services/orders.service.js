const knex = require("./knexConfig");

async function placeOrder(userID, products, paymentMethodID) {
  try {
    if (!products || products.length === 0) {
      throw new Error("Empty product list");
    }

    const order = await knex("orders").insert({
      UserID: userID,
      OrderDate: new Date(),
      Status: "pending",
    });

    let totalPrice = 0;

    for (const product of products) {
      const productID = product.ProductID;
      const quantity = product.Quantity;
      const productInfo = await knex("products")
        .where("ProductID", productID)
        .first();

      if (!productInfo) {
        throw new Error(`Product with ID ${productID} not found`);
      }

      if (productInfo.Quantity < quantity) {
        console.log("Quantity have only:", productInfo.Quantity);
        throw new Error(
          `Not enough quantity in stock for product with ID ${productID}`
        );
      }
      const productTotalPrice = productInfo.Price * quantity;
      totalPrice += productTotalPrice;

      await knex("invoices").insert({
        OrderID: order[0],
        ProductID: product.ProductID,
        Quantity: product.Quantity,
        UnitPrice: productInfo.Price,
        TotalPrice: productTotalPrice,
        SellerUserID: productInfo.SellerUserID,
      });

      await knex("products")
        .where("ProductID", product.ProductID)
        .decrement("quantity", product.Quantity);
    }

    await knex("transactions").insert({
      OrderID: order[0],
      BuyerUserID: userID,
      PaymentMethodID: paymentMethodID,
      Amount: totalPrice,
    });

    return order;
  } catch (error) {
    throw error;
  }
}

async function detailOrder(orderID) {
  try {
    const detailOrderData = await knex("orders")
      .select("orders.*", "invoices.*", "transactions.*")
      .join("invoices", "orders.OrderID", "invoices.OrderID")
      .join("transactions", "transactions.OrderID", "orders.OrderID")
      .where("orders.OrderID", orderID);

    return detailOrderData;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  placeOrder,
  detailOrder,
};
