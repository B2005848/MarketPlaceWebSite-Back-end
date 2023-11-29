const productService = require("../services/products.service");
const ApiError = require("../api-error");

async function createProduct(req, res) {
  const { Name, Description, Price, Quantity, CategoryID } = req.body;

  // Validate the presence of required fields
  if (!Name || !Price || !Quantity || !CategoryID) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const productData = {
      Name,
      Description,
      Price,
      Quantity,
      CategoryID,
    };

    const insertedProduct = await productService.createProduct(productData);
    res.status(201).json({
      message: "Successfully added",
      product: productData,
      productID: insertedProduct,
    });
  } catch (error) {
    console.error(error);

    if (error.message.includes("unique constraint")) {
      res
        .status(400)
        .json({ message: "Duplicate record. The product already exists." });
    } else {
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  }
}
async function getProductByName(req, res) {
  const productName = req.body.name || req.params.name;

  try {
    const product = await productService.getProductByName(productName);

    if (product) {
      res.json({ product });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Assume productService is imported and initialized correctly

async function getAllProducts(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;

    const { products, totalPages } = await productService.getAllProducts(page);
    return res.json({ products, totalPages });
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, "An error while getting all users"));
  }
}

async function updateProduct(req, res) {
  const productId = parseInt(req.params.id);

  // Kiểm tra xem productId có phải là một số hợp lệ hay không
  if (isNaN(productId)) {
    console.log("Invalid productId");
    return res.status(400).json({ message: "Invalid productId" });
  }

  try {
    const { Name, Quantity, Description, Price, ImageURL } = req.body;

    // Kiểm tra xem các trường có giá trị hay không
    if (!Name || !Quantity || !Description || !Price || !ImageURL) {
      console.log("Missing required fields");
      return res.status(400).json({ message: "Missing required fields" });
    }

    // In ra console nếu productId và các trường khác đều hợp lệ
    console.log(
      "Valid productId and all required fields:",
      productId,
      Name,
      Quantity,
      Description,
      Price,
      ImageURL
    );

    // Gọi hàm updateProduct từ productService
    const updatedProduct = await productService.updateProduct(
      productId,
      Name,
      Quantity,
      Description,
      Price,
      ImageURL
    );

    // Kiểm tra xem có sản phẩm được cập nhật thành công hay không
    if (updatedProduct) {
      console.log(
        `Product with ID ${productId} has been updated successfully.`
      );
      res.status(201).json({
        success: true,
        updateData: updatedProduct,
      });
    } else {
      console.log(
        `Product with ID ${productId} does not exist or Name is not updated.`
      );
      res.status(404).json({
        success: false,
        message: "Product not found or Name is not updated",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function deleteProduct(req, res) {
  const productId = parseInt(req.params.id);

  try {
    const message = await productService.deleteProduct(productId);
    res.json({ message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  getAllProducts,
  getProductByName,
  createProduct,
  deleteProduct,
  updateProduct,
};
