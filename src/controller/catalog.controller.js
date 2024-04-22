const catagoiesService = require("../services/catagoies.service");
const ApiError = require("../api-error");

async function getALL(req, res, next) {
  try {
    const data = await catagoiesService.getAll();

    return res.json([data]);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "An error occurred while fetching catalog"));
  }
}

module.exports = {
  getALL,
};
