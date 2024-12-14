const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    image : String,
    title : String,
    description : String,
    Category : String,  
    Brand : String,
    price : Number,
    salePrice : Number,
    totalStock : Number,
},{
    timestamps : true  // Automatically add createdAt and updatedAt fields
})

module.exports = mongoose.model('Product', ProductSchema);

// which line of code is used to create the collection in the database? => module.exports = mongoose.model('Product', ProductSchema);
// which line of code is used to define the product schema? => const ProductSchema = new mongoose.Schema({ ... });
// and which line defines product model? => module.exports = mongoose.model('Product', ProductSchema);