const ApiError = require("../api-error");
const orderService = require("../services/orders.service");

async function placeOrder(req, res, next) {
  try {
    const userID = req.body.userID;
    const products = req.body.products;
    const paymentMethodID = req.body.paymentMethodID;

    const order = await orderService.placeOrder(
      userID,
      products,
      paymentMethodID
    );

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error(error);

    next(new ApiError(500, "An error occurred while creating the order"));
  }
}

module.exports = {
  placeOrder,
};
