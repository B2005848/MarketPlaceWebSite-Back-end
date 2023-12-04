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
      const variantID = product.VariantID;
      console.log(product.variantID);
      const quantity = product.Quantity;
      const productInfo = await knex("product_variants")
        .where("VariantID", product.VariantID)
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
        variantID: variantID,
      });

      await knex("product_variants")
        .where("VariantID", variantID)
        .decrement("Quantity", quantity);
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
      .select(
        "orders.*",
        "invoices.*",
        "invoices.Quantity as Quantityofin",
        "transactions.*",
        "product_variants.*",
        "products.Name as productname"
      )
      .join("invoices", "orders.OrderID", "invoices.OrderID")
      .join("transactions", "transactions.OrderID", "orders.OrderID")
      .join(
        "product_variants",
        "product_variants.VariantID",
        "invoices.VariantID"
      )
      .leftJoin("products", "products.productID", "product_variants.ProductID")
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
