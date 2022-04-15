const mongoose = require('mongoose');
const Product = require('./model/userDetails');





const products = [
    {
        firstName: "Aaditya",
        lastName: "Singh",
        email:"singhaditya2763@gmail.com",
        phone_no:"9467665000",
        
    }
   
];



async function seedDB(){
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('Product Seeded');
}

module.exports=seedDB;

