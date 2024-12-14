const {imageUploadUtil} = require('../../helpers/cloudinary');
const Product = require('../../models/Product');

const handleImageUpload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded."
            });
        }

        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const url = "data:" + req.file.mimetype + ";base64," + b64;
        const result = await imageUploadUtil(url);

        res.status(200).json({
            success: true,
            message: "Image uploaded successfully",
            data: result.secure_url,
            result,
        });

    } catch (error) {
        console.error("Image upload error:", error);
        res.status(500).json({
            success: false,
            message: "Error occurred: " + error.message
        });
    }
}


// add a new product
const addProduct = async (req, res) => {
    try {
        const{image, title, description, Category, Brand, price, salePrice, totalStock} = req.body;  // destructuring the request body


        const newlyCreatedProduct = new Product({
            image, title, description, Category, Brand, price, salePrice, totalStock
        })

        await newlyCreatedProduct.save();
        res.status(201).json({
            success: true,
            message: "Product added successfully",
            data: newlyCreatedProduct
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error occurred: " + error.message
        })
    }
}


// fetch all product
const fetchAllProducts = async (req, res) => {
    try {
        
        const listOfPRoducts = await Product.find({});
        res.status(200).json({
            success: true,
            message: "All products fetched successfully",
            data: listOfPRoducts
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error occurred: " + error.message
        })
    }
}


// edit a product
const editProduct = async (req, res) => {
    try {
        
        const {id} = req.params;
        const {image, title, description, Category, Brand, price, salePrice, totalStock} = req.body;

        let findProduct = await Product.findById(id);
        if(!findProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        findProduct.image = image || findProduct.image;
        findProduct.title = title || findProduct.title;
        findProduct.description = description || findProduct.description;
        findProduct.Category = Category || findProduct.Category;
        findProduct.Brand = Brand || findProduct.Brand;
        findProduct.price = price === "" ? 0 : price || findProduct.price;
        findProduct.salePrice = salePrice === "" ? 0 : salePrice || findProduct.salePrice;
        findProduct.totalStock = totalStock || findProduct.totalStock;

        await findProduct.save();
        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: findProduct
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error occurred: " + error.message
        })
    }
}


// delete a product
const deleteProduct = async (req, res) => {
    try {
        
        const {id} = req.params;

        const product = await Product.findByIdAndDelete(id);
        if(!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            data: product
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error occurred: " + error.message
        })
    }
}

module.exports = {
    handleImageUpload, addProduct, fetchAllProducts, editProduct, deleteProduct
}