const ApiError = require("../api-error");
const orderService = require("../services/orders.service");

async function placeOrder(req, res, next) {
  try {
    const userID = req.body.userID;
    const numberPhone = req.body.Phone;
    const products = req.body.products;
    const paymentMethodID = req.body.paymentMethodID;

    const order = await orderService.placeOrder(
      userID,
      numberPhone,
      products,
      paymentMethodID
    );

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error(error);

    next(new ApiError(500, "An error occurred while creating the order"));
  }
}

async function getAllOrder(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const { OrderData, totalPages } = await orderService.getAllOrder(page);
    console.log(OrderData, totalPages);
    res.status(201).json({ message: "Order data:", OrderData, totalPages });
  } catch (error) {
    console.error(error);

    next(new ApiError(500, "An error occurred while creating the order"));
  }
}

async function detailOrder(req, res, next) {
  try {
    const orderID = req.body.orderID || req.params.orderID;

    const detailOrderData = await orderService.detailOrder(orderID);
    console.log(detailOrderData);
    res
      .status(201)
      .json({ message: "Order placed successfully", detailOrderData });
  } catch (error) {
    console.error(error);

    next(new ApiError(500, "An error occurred while creating the order"));
  }
}

async function submitOrder(req, res, next) {
  try {
    const orderID = req.body.orderID || req.params.orderID;
    const status = req.body.Status;

    const data = await orderService.submitOrder(orderID, status);
    console.log(data);

    res
      .status(201)
      .json({ message: "Order updated successfully", updatedStatus: status });
  } catch (error) {
    console.error(error);

    next(new ApiError(500, "An error occurred while updating the order"));
  }
}

module.exports = {
  placeOrder,
  getAllOrder,
  submitOrder,
  detailOrder,
};
