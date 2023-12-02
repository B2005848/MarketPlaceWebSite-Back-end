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

async function getAllProducts(page) {
  try {
    const itemsPerPage = 12;
    const offset = (page - 1) * itemsPerPage;

    const totalProducts = await knex("products")
      .count("* as totalCount")
      .first();
    const totalItems = totalProducts.totalCount;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const products = await knex("products")
      .select("products.*", "product_variants.*")
      .leftJoin(
        "product_variants",
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

async function updateProduct(VariantID, variantData, productData) {
  try {
    const product = await knex("product_variants")
      .select("productID")
      .where("VariantID", VariantID)
      .first();

    if (!product) {
      console.log(`Product with VariantID ${VariantID} does not exist.`);
      return null;
    }

    const productID = product.productID;

    const updateResult = await knex("product_variants")
      .where("VariantID", VariantID)
      .update(variantData);

    const updateData = await knex("products")
      .where("productID", productID)
      .update(productData);

    if (updateResult > 0 && updateData > 0) {
      const updatedProduct = await knex("products")
        .where("ProductID", productID)
        .first();
      console.log("Received data:", updatedProduct);
      console.log(`Update product details for ProductID ${productID} success`);

      return updatedProduct;
    } else {
      console.log(
        `Product with ID ${productID} does not exist or not updated.`
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
  getProductByName,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
