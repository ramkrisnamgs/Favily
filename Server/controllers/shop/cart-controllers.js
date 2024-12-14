// Server/controllers/shop/cart-controller.js

const Cart = require("../../models/Cart"); // Importing the Cart model
const Product = require("../../models/Product"); // Importing the Product model

/**
 **addToCart Function**
 * 
 * Adds a product to the user's cart or updates the quantity if it already exists.
 * 
 * @param {Object} req - The request object containing user ID, product ID, and quantity.
 * @param {Object} res - The response object used to send back the cart data.
 */
const addToCart = async (req, res) => {
  try {
    console.log("Incoming body Params:", req.body); // Log incoming request body
    const { userId, productId, quantity } = req.body; // Destructure request body

    // Validate input data
    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!", // Send error response for invalid data
      });
    }

    const product = await Product.findById(productId); // Fetch product by ID

    // Check if product exists
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found", // Send error response if product not found
      });
    }

    let cart = await Cart.findOne({ userId }); // Find user's cart

    // If cart does not exist, create a new one
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Find the index of the current product in the cart
    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    // If product is not in the cart, add it
    if (findCurrentProductIndex === -1) {
      cart.items.push({ productId, quantity });
    } else {
      // If product is already in the cart, update the quantity
      cart.items[findCurrentProductIndex].quantity += quantity;
    }

    await cart.save(); // Save the updated cart

    // Send response with the updated cart data
    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.log(error); // Log any errors
    res.status(500).json({
      success: false,
      message: "Error", // Send error response
    });
  }
};

/**
 **fetchCartItems Function**
 * 
 * Retrieves the items in the user's cart.
 * 
 * @param {Object} req - The request object containing user ID in params.
 * @param {Object} res - The response object used to send back the cart items.
 */
const fetchCartItems = async (req, res) => {
  try {
    const { userId } = req.params; // Extract user ID from request parameters

    // Validate user ID
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User id is mandatory!", // Send error response for missing user ID
      });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice", // Populate product details
    });

    // Check if cart exists
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!", // Send error response if cart not found
      });
    }

    // Filter out invalid items from the cart
    const validItems = cart.items.filter(
      (productItem) => productItem.productId
    );

    // Update cart items if there are invalid items
    if (validItems.length < cart.items.length) {
      cart.items = validItems;
      await cart.save(); // Save the updated cart
    }

    // Prepare the response data
    const populateCartItems = validItems.map((item) => ({
      productId: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity,
    }));

    // Send response with the cart data
    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error); // Log any errors
    res.status(500).json({
      success: false,
      message: "Error", // Send error response
    });
  }
};

/**
 * **updateCartItemQty Function**
 * 
 * Updates the quantity of a specific item in the user's cart.
 * 
 * @param {Object} req - The request object containing user ID, product ID, and new quantity.
 * @param {Object} res - The response object used to send back the updated cart data.
 */
const updateCartItemQty = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body; // Destructure request body

    // Validate input data
    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!", // Send error response for invalid data
      });
    }

    const cart = await Cart.findOne({ userId }); // Find user's cart

    // Check if cart exists
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!", // Send error response if cart not found
      });
    }

    // Find the index of the current product in the cart
    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    // Check if product is in the cart
    if (findCurrentProductIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Cart item not present!", // Send error response if product not found in cart
      });
    }

    // Update the quantity of the product in the cart
    cart.items[findCurrentProductIndex].quantity = quantity;
    await cart.save(); // Save the updated cart

    // Populate product details
    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    // Prepare the response data
    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
    }));

    // Send response with the updated cart data
    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error); // Log any errors
    res.status(500).json({
      success: false,
      message: "Error", // Send error response
    });
  }
};

/**
 * **deleteCartItem Function**
 * 
 * Removes a specific item from the user's cart.
 * 
 * @param {Object} req - The request object containing user ID and product ID in params.
 * @param {Object} res - The response object used to send back the updated cart data.
 */
const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params; // Extract user ID and product ID from request parameters

    // Validate input data
    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!", // Send error response for invalid data
      });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice", // Populate product details
    });

    // Check if cart exists
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!", // Send error response if cart not found
      });
    }

    // Filter out the item to be deleted from the cart
    cart.items = cart.items.filter(
      (item) => item.productId._id.toString() !== productId
    );

    await cart.save(); // Save the updated cart

    // Populate product details
    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    // Prepare the response data
    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
    }));

    // Send response with the updated cart data
    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error); // Log any errors
    res.status(500).json({
      success: false,
      message: "Error", // Send error response
    });
  }
};

// Exporting the controller functions
module.exports = {
  addToCart,
  fetchCartItems,
  updateCartItemQty,
  deleteCartItem,
};