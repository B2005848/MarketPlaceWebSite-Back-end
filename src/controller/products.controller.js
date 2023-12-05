const productService = require("../services/products.service");
const ApiError = require("../api-error");
const fs = require("fs");
const path = require("path");

async function createProducts(req, res) {
  const productsData = req.body;

  // Validate the presence of required fields
  if (!Array.isArray(productsData) || productsData.length === 0) {
    return res.status(400).json({ message: "Invalid product data." });
  }

  try {
    // Validate each product in the array
    for (const product of productsData) {
      if (!product.Name || !product.CategoryID) {
        return res.status(400).json({ message: "All fields are required." });
      }
    }

    const insertedProducts = await productService.createProduct(productsData);
    res.status(201).json({
      message: "Successfully added",
      products: productsData,
      insertedProductIDs: insertedProducts,
    });
  } catch (error) {
    console.error(error);

    if (error.message.includes("unique constraint")) {
      res
        .status(400)
        .json({ message: "Duplicate record. Some products already exist." });
    } else {
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  }
}

async function createVariantProduct(req, res) {
  const variantData = {
    ProductID: req.params.id,
    Size: req.body.Size,
    Material: req.body.Material,
    ImageURL: req.body.ImageURL,
    Quantity: req.body.Quantity,
    Price: req.body.Price,
    Description: req.body.Description,
  };

  try {
    const imageFileName = path.basename(req.body.ImageURL);
    const imagePath = path.join(__dirname, "../uploads", imageFileName);

    if (fs.existsSync(imagePath)) {
      res.status(400).json({ message: "Lỗi ." });
      return;
    }

    const imageBase64 = req.body.ImageURL.split(";base64,").pop();
    fs.writeFileSync(imagePath, Buffer.from(imageBase64, "base64"));

    variantData.ImageURL = imageFileName;

    await productService.createVariantProduct(variantData);
    res.status(201).json({
      message: "Successfully added",
      product: variantData,
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

// list product_variants
async function getVariantProducts(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const productID = req.params.id;
    const { products, totalPages } = await productService.getVariantProducts(
      page,
      productID
    );
    return res.json({ products, totalPages });
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, "An error while getting all products"));
  }
}

// get product_variant by VariantID
async function getproductVariant(req, res, next) {
  try {
    const VariantID = req.params.id;
    const product_variant = await productService.getproductVariant(VariantID);
    return res.json(product_variant);
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, "An error while getting all products"));
  }
}

// ADMIN PAGE
async function getAllProductsAdmin(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const { products, totalPages } = await productService.getAllProductsAdmin(
      page
    );
    return res.json({ products, totalPages });
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, "An error while getting all products"));
  }
}

// productController.js
async function updateVarProduct(req, res) {
  const VariantID = req.params.id;
  const variantData = {
    Size: req.body.Size,
    Material: req.body.Material,
    ImageURL: req.body.ImageURL,
    Price: req.body.Price,
    Description: req.body.Description,
    Quantity: req.body.Quantity,
  };

  if (req.body.ImageURL) {
    try {
      const imageFileName = path.basename(req.body.ImageURL);
      const imagePath = path.join(__dirname, "../uploads", imageFileName);

      const imageBase64 = req.body.ImageURL.split(";base64,").pop();
      fs.writeFileSync(imagePath, Buffer.from(imageBase64, "base64"));
      console.log(`Image saved to: ${imagePath}`);

      // Cập nhật đường dẫn hình ảnh trong variantData
      variantData.ImageURL = imageFileName;
    } catch (error) {
      console.error("Error saving image:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  try {
    const updatedProduct = await productService.updateVarProduct(
      VariantID,
      variantData
    );

    if (updatedProduct) {
      console.log(
        `Product with VariantID ${VariantID} has been updated successfully.`
      );
      res.status(201).json({
        success: true,
        updateData: updatedProduct,
      });
    } else {
      console.log(
        `Product with VariantID ${VariantID} does not exist or not updated.`
      );
      res.status(404).json({
        success: false,
        message: `Product with VariantID ${VariantID} not found or not updated`,
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

// USER PAGE
async function getAllProducts(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;

    const { products, totalPages } = await productService.getAllProducts(page);
    return res.json({ products, totalPages });
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, "An error while getting all products"));
  }
}
module.exports = {
  getAllProductsAdmin,
  getAllProducts,
  createVariantProduct,
  getproductVariant,
  getProductByName,
  getVariantProducts,
  createProducts,
  deleteProduct,
  updateVarProduct,
};
