const ApiError = require("../api-error");
const oderService = require("../services/oders.service");

async function order(req, res, next) {
  try {
    const usernameData = req.body.username;
    const orderData = {
      Status: "pending",
    };

    const invoiceData = {
      productID: req.body.productID,
      quantity: req.body.quantity,
      unitPrice: req.body.unitPrice,
    };

    const order = await oderService.oderProducts(
      usernameData,
      orderData,
      invoiceData
    );
    return res.status(201).json(order);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "An error occurred while creating the user"));
  }
}
module.exports = {
  order,
};
