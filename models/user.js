const mongoose = require("mongoose");
const {Schema} = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type:String,
        required:true
    }
    //passport local mongoose will add username and password field 
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);