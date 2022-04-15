const mongoose = require('mongoose');




const productSchema = new mongoose.Schema({
    username:String,
    firstName: String,
    lastName: String,
    email:String,
    phone_no:String,
 
});







const Product = mongoose.model('Product', productSchema);


module.exports = Product;


