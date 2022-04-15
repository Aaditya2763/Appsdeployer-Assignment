const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');


const userSchema = new mongoose.Schema({
    email: String,
    firstName: String,
    lastName: String,
    email:String,
    phone_no:String,
    // username,hash and salt will be added by  passport local mongoose
    

});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);