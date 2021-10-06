const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Secure pass
//https://www.geeksforgeeks.org/nodejs-authentication-using-passportjs-and-passport-local-mongoose/

// Create a simple User's schema 
const userSchema = new mongoose.Schema({
    name: String,
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    }
});


const UserModel = new mongoose.model('User', userSchema);
module.exports = UserModel
