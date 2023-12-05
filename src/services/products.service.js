const knex = require("./knexConfig");

// create products with JSON
async function createProduct(productData) {
  try {
    const product = await knex("products").insert(productData);

    if (product) {
      return product;
    } else {
      console.log("ERROR!!!:");
    }
  } catch (error) {
    throw error;
  }
}

async function createVariantProduct(variantData) {
  try {
    const product = await knex("product_variants").insert(variantData);

    if (product) {
      return product;
    } else {
      console.log("ERROR!!!:");
    }
  } catch (error) {
    throw error;
  }
}

// sort/ find product with name
async function getProductByName(name) {
  try {
    const products = await knex("products")
      .select("*")
      .where("name", "like", `%${name}%`);

    if (products && products.length > 0) {
      console.log(`List products have name: "${name}":`, products);
      return products;
    } else {
      console.log(`Dont have any products with name"${name}"`);
      return null;
    }
  } catch (error) {
    throw error;
  }
}

// get variantion of products by productID
async function getVariantProducts(page, productID) {
  try {
    const itemsPerPage = 12;
    const offset = (page - 1) * itemsPerPage;

    const totalProducts = await knex("product_variants")
      .count("* as totalCount")
      .where("ProductID", productID)
      .first();
    const totalItems = totalProducts.totalCount;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const products = await knex("product_variants")
      .select("product_variants.*", "products.Name as productname")
      .leftJoin(
        "products",
        "products.ProductID",
        "=",
        "product_variants.ProductID"
      )
      .where("product_variants.ProductID", productID)
      .limit(itemsPerPage)
      .offset(offset);

    console.log("Get list of product variants success:");
    console.log(products);

    return { products, totalPages };
  } catch (error) {
    console.log("Get list of product variants fail", error);
    throw error;
  }
}

// get product_variant by VariantID
async function getproductVariant(VariantID) {
  try {
    const product_variant = await knex("product_variants").where(
      "VariantID",
      VariantID
    );

    console.log("Get success:");
    console.log(product_variant);

    return product_variant;
  } catch (error) {
    console.log("Get list of all products fail", error);
    throw error;
  }
}

// for admin page
async function getAllProductsAdmin(page) {
  try {
    const itemsPerPage = 10;
    const offset = (page - 1) * itemsPerPage;

    const totalProducts = await knex("products")
      .count("* as totalCount")
      .first();
    const totalItems = totalProducts.totalCount;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const products = await knex("products")
      .select("products.*", "categories.CategoryName as CategoryName")
      .leftJoin("Categories", "Categories.CategoryID", "products.CategoryID")
      .limit(itemsPerPage)
      .offset(offset);

    console.log("Get list of all products success:");
    console.log(products);

    return { products, totalPages };
  } catch (error) {
    console.log("Get list of all products fail", error);
    throw error;
  }
}

// get all products for users
async function getAllProducts(page) {
  try {
    const itemsPerPage = 12;
    const offset = (page - 1) * itemsPerPage;

    const totalProducts = await knex("product_variants")
      .count("* as totalCount")
      .first();
    const totalItems = totalProducts.totalCount;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const products = await knex("product_variants")
      .select(
        "products.Name as productname",
        "product_variants.*",
        "products.CategoryID"
      )
      .leftJoin(
        "products",
        "product_variants.ProductID",
        "=",
        "products.ProductID"
      )
      .limit(itemsPerPage)
      .offset(offset);

    console.log("Get list of all products success:");
    console.log(products);

    return { products, totalPages };
  } catch (error) {
    console.log("Get list of all products fail", error);
    throw error;
  }
}

// update product_variants
async function updateVarProduct(VariantID, variantData) {
  try {
    const updateResult = await knex("product_variants")
      .where("VariantID", VariantID)
      .update(variantData);

    if (updateResult > 0) {
      const updatedProduct = await knex("product_variants")
        .where("VariantID", VariantID)
        .first();
      console.log("Received data:", updatedProduct);
      console.log(
        `Update product_variants details for VariantID ${VariantID} success`
      );

      return updatedProduct;
    } else {
      console.log(
        `Product with ID ${VariantID} does not exist or not updated.`
      );
      return null;
    }
  } catch (error) {
    console.log("An error occurred while updating product details", error);
    throw error;
  }
}

async function deleteProduct(productId) {
  let transaction;

  try {
    transaction = await knex.transaction();

    const product = await transaction("products")
      .where("ProductID", productId)
      .first();

    if (!product) {
      console.log("Product does not exist");
      await transaction.rollback();
      return null;
    }

    await transaction("products").where("ProductID", productId).del();

    await transaction.commit();

    console.log(`Product with ID ${productId} has been deleted successfully.`);

    return `Product with ID ${productId} has been deleted successfully.`;
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
      console.error("An error occurred while deleting the product", error);
    }
    throw error;
  }
}

module.exports = {
  createProduct,
  createVariantProduct,
  getProductByName,
  getAllProductsAdmin,
  getAllProducts,
  getVariantProducts,
  getproductVariant,
  updateVarProduct,
  deleteProduct,
};
