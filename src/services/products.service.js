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
    const itemsPerPage = 10;
    const offset = (page - 1) * itemsPerPage;

    const totalProducts = await knex("products")
      .count("* as totalCount")
      .first();
    const totalItems = totalProducts.totalCount;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const products = await knex("products")
      .select("products.*", "users.username as username")
      .join("users", "users.UserID", "Products.SellerUserID")
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

async function updateProduct(
  productId,
  name,
  quantity,
  description,
  price,
  imageURL
) {
  try {
    // Kiểm tra xem sản phẩm có tồn tại không
    const existingProduct = await knex("products")
      .select("ProductID")
      .where("ProductID", "like", `%${productId}%`);

    if (!existingProduct) {
      console.log("Product does not exist");
      return null;
    }

    const updatedData = {
      Name: name,
      Quantity: quantity,
      Description: description,
      Price: price,
      ImageURL: imageURL,
      // Các trường khác nếu cần
    };

    await knex("products").where("ProductID", productId).update(updatedData);
    console.log("Received data:", updatedData);
    console.log(`Update product details for ProductID ${productId} success`);
    return productId, updatedData;
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
