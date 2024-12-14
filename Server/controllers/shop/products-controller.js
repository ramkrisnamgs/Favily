// Server/controllers/shop/products-controller.js

const Product = require("../../models/Product"); // Importing the Product model

/**
 **getFilteredProducts Function**
 * 
 * Retrieves products based on filter criteria from the request query parameters.
 * 
 * @param {Object} req - The request object containing query parameters.
 * @param {Object} res - The response object used to send back the filtered products.
 */
const getFilteredProducts = async (req, res) => {
  console.log("Incoming Query Params:", req.query); // Log incoming query parameters
  try {
    // Destructure query parameters with default values
    const { Category = [], Brand = [], sortBy = "price-lowtohigh" } = req.query;

    let filter = {}; // Initialize filter object
    if (Category.length) {
      filter.Category = { $in: Category.split(",") }; // Filter by categories
    }
    if (Brand.length) {
      filter.Brand = { $in: Brand.split(",") }; // Filter by brands
    }

    console.log("Filter Object:", filter); // Log the filter object

    let sort = {}; // Initialize sort object

    // Determine sorting criteria based on sortBy parameter
    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1; // Ascending order by price
        break;
      case "price-hightolow":
        sort.price = -1; // Descending order by price
        break;
      case "title-atoz":
        sort.title = 1; // Ascending order by title
        break;
      case "title-ztoa":
        sort.title = -1; // Descending order by title
        break;
      default:
        sort.price = 1; // Default to ascending order by price
        break;
    }

    // Fetch products from the database based on filter and sort criteria
    const products = await Product.find(filter).sort(sort);

    // Send response with the filtered products
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.log(error); // Log any errors

    // Send error response
    res.status(500).json({
      success: false,
      message: "Some Error occurred",
    });
  }
};

/**
 **getProductDetails Function**
 * 
 * Retrieves details of a specific product by its ID.
 * 
 * @param {Object} req - The request object containing the product ID in params.
 * @param {Object} res - The response object used to send back the product details.
 */
const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params; // Extract product ID from request parameters
    const product = await Product.findById(id); // Fetch product by ID

    if (!product) // Check if product exists
      return res.status(404).json({
        success: false,
        message: "Product not found!", // Send not found response
      });

    // Send response with product details
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (e) {
    console.log(e); // Log any errors
    res.status(500).json({
      success: false,
      message: "Product not found!", // Send error response
    });
  }
};

// Exporting the controller functions
module.exports = {
  getFilteredProducts,
  getProductDetails,
};