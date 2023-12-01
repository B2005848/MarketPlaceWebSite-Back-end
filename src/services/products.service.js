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
      .select("products.*", "images.ImageURL")
      .leftJoin("images", "images.ProductID", "=", "products.ProductID")
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

async function updateProduct(productID, data) {
  try {
    await knex("products").where("ProductID", productID).update(data);
    console.log("Received data:", data);
    console.log(`Update product details for ProductID ${productID} success`);
    return productID, data;
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
