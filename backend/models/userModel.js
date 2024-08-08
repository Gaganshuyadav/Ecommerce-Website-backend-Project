const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: [ true, "Please Enter Your Name"],
        maxLength: [30, "Name cannot exceed 30 Characters"],
        minLength: [4, "Name should have  more than 4 Characters"]
    },
    email:{
        type:String,
        required: [true, "Please Enter Your Email"],
        unique:true,                                    //each user should have unique emails, if two email are same than duplicate key error occurs
        validate: [ validator.isEmail, "Please enter a valid email"]
    },
    password:{
        type:String,
        required: [ true, "Please Enter Your Password"],
        minLength: [ 8, "Password should be greater than 8 characters"],
        select: false                         
    },
    avatar:{
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        }
    },
    role:{
        type: String,
        default:"user",
    },
    resetPasswordToken:{
        type: String
    },
    resetPasswordExpire:{
        type: Date,
    },
})

// convert password into hash password
userSchema.pre("save", async function( next){               //arrow function not work for ,this keyword which refers to the calling object
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
})

// JWT TOKEN
userSchema.methods.getJWTToken = function() {
        return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
        });
};

// Compare Password
userSchema.methods.comparePassword = function( enteredPassword ){
    return bcrypt.compare( enteredPassword , this.password);
    
}

// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function( ) {
    
    // Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = new Date( Date.now() + 15 * 60 * 60 * 1000 );

    return resetToken;

}

module.exports = mongoose.model( "User", userSchema);