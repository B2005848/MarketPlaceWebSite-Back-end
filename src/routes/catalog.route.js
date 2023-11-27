const express = require("express");
const catalogController = require("../controller/catalog.controller.js");

const router = express.Router();

router.get("/getall", catalogController.catalog);

module.exports = router;
