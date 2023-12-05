// url
const express = require("express");
const ProductsController = require("../controller/products.controller");
const OrdersController = require("../controller/oders.controller");

const router = express.Router();

// orders
router.post("/orders/create", OrdersController.placeOrder);
router.get("/orders/details", OrdersController.detailOrder);
router.get("/orders/details/:orderID", OrdersController.detailOrder);
router.get("/orders", OrdersController.getAllOrder);

router.post("/create", ProductsController.createProducts);
router.post("/create-variants/:id", ProductsController.createVariantProduct);

router.get("/getProductsByName", ProductsController.getProductByName);
router.get("/getProductsByName/:name", ProductsController.getProductByName);

router.get("/getAllProducts", ProductsController.getAllProducts);
router.get("/getAllProductsAdmin", ProductsController.getAllProductsAdmin);

router.get("/getVariantProduct/:id", ProductsController.getVariantProducts);
router.get("/ProductVariant/:id", ProductsController.getproductVariant);

router.put("/updateVarProduct/:id", ProductsController.updateVarProduct);

router.delete("/deleteProduct/:id", ProductsController.deleteProduct);

module.exports = router;
