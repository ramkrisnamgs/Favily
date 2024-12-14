const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Cloudinary configuration for file upload
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});


// Multer configuration for file upload
const storage = new multer.memoryStorage();


async function imageUploadUtil(file) {
    const result = await cloudinary.uploader.upload(file, {
        resource_type: "auto",
    })

    return result;
}


// Multer configuration for file upload
const upload = multer({storage: storage});

module.exports = {upload, imageUploadUtil};


// what does this file do: it configures the cloudinary and multer for file upload and then exports the upload and imageUploadUtil functions that are used for uploading the image to the cloudinary and then storing the image url in the database and these functions are used in the products-controller.js file.

// where is this file used: it is used in the products-controller.js file

// where adminProductsRouter is defined: it is defined in the routes/admin/products.routes.js file