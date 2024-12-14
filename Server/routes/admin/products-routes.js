const express = require('express');
const {handleImageUpload, addProduct, editProduct, deleteProduct, fetchAllProducts} = require('../../controllers/admin/products-controller.js');
const {upload} = require('../../helpers/cloudinary.js');
const router = express.Router();


router.post('/upload-image', upload.single('my_file'), handleImageUpload);
router.post('/add', addProduct);
router.put('/edit/:id', editProduct);
router.delete('/delete/:id', deleteProduct);
router.get('/get', fetchAllProducts);


// which file does the below line exports: it exports the router that is used in the server.js file . and what is the name of the router that are exporting from this file: the name of the router that are exporting from this file is adminProductsRouter. how will i know that this file is exporting adminProductsRouter? because the name of the file is products.routes.js and the name of the router that is exported from this file is adminProductsRouter. where is it defined that the name of this router is adminProductsRouter: it is defined in the server.js file where we are importing this file and then using the adminProductsRouter in the app.use('/api/admin/products', adminProductsRouter) line.
module.exports = router;