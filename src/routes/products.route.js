// url
const express = require("express");
const ProductsController = require("../controller/products.controller");
const OrdersController = require("../controller/oders.controller");

const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
// orders
router.post("/orders/create", OrdersController.placeOrder);
router.get("/orders/details", OrdersController.detailOrder);
router.get("/orders/details/:orderID", OrdersController.detailOrder);

router.post("/create", ProductsController.createProduct);

router.get("/getProductsByName", ProductsController.getProductByName);
router.get("/getProductsByName/:name", ProductsController.getProductByName);

router.get("/getAllProducts", ProductsController.getAllProducts);

router.put("/updateProduct/:id", ProductsController.updateProduct);

router.delete("/deleteProduct/:id", ProductsController.deleteProduct);

module.exports = router;
