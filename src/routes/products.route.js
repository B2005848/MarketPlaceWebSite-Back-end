// url
const express = require("express");
const ProductsController = require("../controller/products.controller");
const OrdersController = require("../controller/oders.controller");

const router = express.Router();

router.post("/orders/create", OrdersController.placeOrder);

router.post("/create", ProductsController.createProduct);

router.get("/getProductsByName", ProductsController.getProductByName);
router.get("/getProductsByName/:name", ProductsController.getProductByName);

router.get("/getAllProducts", ProductsController.getAllProducts);

router.put("/updateProduct/:id", ProductsController.updateProduct);

router.delete("/deleteProduct/:id", ProductsController.deleteProduct);

module.exports = router;
