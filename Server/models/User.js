const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName : {
        type : String,
        required : true,
        unique : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,  
    },
    password : {
        type : String,
        required : true,
    },
    role : {
        type : String,
        default : "user"
    }
})


const User = mongoose.model("User", userSchema);

module.exports = User;



// write the steps includes in creating a model
// 1. define the schema :- 
        // a. define the schema
        // b. add the required fields
        // c. add the unique fields
// 2. create the model
        // a. create the model using mongoose.model("modelName", schemaName)
// 3. export the model
        // a. export the model using module.exports