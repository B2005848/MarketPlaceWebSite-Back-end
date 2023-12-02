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

// productController.js
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const writeFileAsync = promisify(fs.writeFile);

async function updateProduct(req, res) {
  const variantID = req.params.id;
  const variantData = {
    Size: req.body.Size,
    Color: req.body.Color,
    Price: req.body.Price,
    ImageURL: req.body.ImageURL,
  };

  const productData = {
    Name: req.body.Name,
    Quantity: req.body.Quantity,
    CategoryID: req.body.CategoryID,
    Description: req.body.Description,
  };

  try {
    if (req.body.ImageURL) {
      const base64Data = req.body.ImageURL.replace(
        /^data:image\/png;base64,/,
        ""
      );
      const imagePath = path.join(
        process.cwd(),
        "uploads",
        variantData.ImageURL
      );

      await writeFileAsync(imagePath, base64Data, "base64");

      variantData.ImageURL = `/uploads/${variantData.ImageURL}`;
    }

    const updatedProduct = await productService.updateProduct(
      variantID,
      variantData,
      productData
    );

    if (updatedProduct) {
      console.log(
        `Product with VariantID ${variantID} has been updated successfully.`
      );
      res.status(200).json({
        success: true,
        updateData: updatedProduct,
      });
    } else {
      console.log(
        `Product with VariantID ${variantID} does not exist or not updated.`
      );
      res.status(404).json({
        success: false,
        message: `Product with VariantID ${variantID} not found or not updated`,
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
