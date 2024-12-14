require('dotenv').config();

const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const authRoutes = require('./routes/auth/auth-routes')
const adminProductsRouter = require('./routes/admin/products-routes')
// const adminOrderRouter = require('./routes/admin/order-routes')

const shopProductsRouter = require('./routes/shop/products-routes')
const shopCartRouter = require('./routes/shop/cart-routes')
const shopAddressRouter = require('./routes/shop/address-routes');
// const shopOrderRouter = require('./routes/shop/order-routes');
const shopSearchRouter = require('./routes/shop/search-routes');
const shopReviewRouter = require("./routes/shop/review-routes");

const commonFeatureRouter = require("./routes/common/feature-routes");


//create a database connection -> u can also create a seperate file for this and then import/use that file here
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.log(error)
);


const app = express()
const PORT = process.env.PORT || 5000;



app.use(
    cors({
        origin: process.env.CLIENT_BASE_URL,
        methods: ['GET', 'POST', 'DELETE', 'PUT'],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "Cache-Control",
            "Expires",
            "Pragma"
        ],
        credentials: true
    })
)

app.use(cookieParser())                  // this is used to parse the cookie from the request
app.use(express.json())                 // this is used to parse the json data from the request body


app.use('/api/auth', authRoutes);       // this is the route for the auth routes  i.e. http://localhost:5000/api/auth/register -> registerUser function will be called that is used for registering a user and hashing the password and then storing the user in the database and this function is defined in auth-controller.js file

// what will (https://localhost:5173/api/admin/products/ ) do: it will call the adminProductsRouter and then the adminProductsRouter will call the handleImageUpload function that is used for uploading the image to the cloudinary and then storing the image url in the database and this function is defined in products-controller.js file.
//where is the adminProductsRouter defined: it is defined in the routes/admin/products.routes.js file
app.use('/api/admin/products', adminProductsRouter); // this is the route for the admin products routes i.e. http://localhost:5000/api/admin/products/upload-image -> handleImageUpload function will be called that is used for uploading the image to the cloudinary and then storing the image url in the database and this function is defined in products-controller.js file.
// app.use('/api/admin/orders', adminOrderRouter); // this is the route for the admin products routes i.e. http://localhost:5000/api/admin/products/upload-image -> handleImageUpload function will be called that is used for uploading the image to the cloudinary and then storing the image url in the database and this function is defined in products-controller.js file.

app.use('/api/shop/products', shopProductsRouter); // this is the route for the shop products routes i.e. http://localhost:5000/api/shop/products/get -> getFilteredProducts function will be called that is used for getting the list of all the products and this function is defined in products-controller.js file.
app.use('/api/shop/cart', shopCartRouter); // this is the route for the shop cart routes i.e. http://localhost:5000/api/shop/cart/add -> addToCart function will be called that is used for adding the product to the cart and this function is defined in cart-controller.js file.
app.use('/api/shop/address', shopAddressRouter); // this is the route for the shop address routes i.e. http://localhost:5000/api/shop/address/add -> addAddress function will be called that is used for adding the address to the database and this function is defined in address-controller.js file.
// app.use('/api/shop/order', shopOrderRouter); // this is the route for the shop order routes i.e. http://localhost:5000/api/shop/order/create -> createOrder function will be called that is used for creating the order and this function is defined in order-controller.js file.
app.use('/api/shop/search', shopSearchRouter); // this is the route for the shop search routes i.e. http://localhost:5000/api/shop/search/keyword -> searchProducts function will be called that is used for searching the products and this function is defined in search-controller.js file.
app.use("/api/shop/review", shopReviewRouter); // this is the route for the shop review routes i.e. http://localhost:5000/api/shop/review/add -> addProductReview function will be called that is used for adding the review to the product and this function is defined in product-review-controller.js file.

app.use("/api/common/feature", commonFeatureRouter); // this is the route for the

// app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
