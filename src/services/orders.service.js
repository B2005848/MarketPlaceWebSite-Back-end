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
        throw new Error(
          `Not enough quantity in stock for product with ID ${productID}`
        );
      }

      // Tính tổng giá trị cho từng sản phẩm
      const productTotalPrice = productInfo.Price * quantity;
      totalPrice += productTotalPrice;

      // Thêm sản phẩm vào bảng invoices
      await knex("invoices").insert({
        OrderID: order[0],
        ProductID: product.ProductID,
        Quantity: product.Quantity,
        UnitPrice: productInfo.Price,
        TotalPrice: productTotalPrice,
        SellerUserID: productInfo.SellerUserID, // Sử dụng SellerUserID của sản phẩm
      });

      // Giảm số lượng sản phẩm trong kho
      await knex("products")
        .where("ProductID", product.ProductID)
        .decrement("quantity", product.Quantity);
    }

    // Thêm giao dịch vào bảng transactions
    // Ở đây, giả sử nếu có nhiều SellerUserID khác nhau, bạn có thể chọn SellerUserID của sản phẩm đầu tiên trong danh sách.
    const sellerUserID = products[0].SellerUserID;
    await knex("transactions").insert({
      OrderID: order[0],
      BuyerUserID: userID,
      SellerUserID: sellerUserID,
      PaymentMethodID: paymentMethodID,
      Amount: totalPrice,
    });

    return order;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  placeOrder,
};
