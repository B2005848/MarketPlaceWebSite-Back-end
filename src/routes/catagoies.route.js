// url
const express = require("express");

const CataController = require("../controller/catalog.controller");

const router = express.Router();

// orders
router.get("/getall", CataController.getALL);

module.exports = router;
