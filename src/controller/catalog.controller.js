const ApiError = require("../api-error");
const catalogService = require("../services/catalog.service");

async function catalog(req, res, next) {
  try {
    const data = await catalogService.getCatalog();
    res.status(200).json({ message: "data list cata: ", data });
  } catch (error) {
    console.error(error);
    next(new ApiError(500, "An error occurred while creating the order"));
  }
}

module.exports = {
  catalog,
};
