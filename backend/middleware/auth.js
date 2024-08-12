const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthenticatedUser = catchAsyncErrors( async( req, res, next)=>{
    
    const {token} = req.cookies;

    if(!token){
       next( new ErrorHandler( 401, " Please Login to access this resource"));
    }

    const decodeData = jwt.verify( token, process.env.JWT_SECRET);

    req.user = await User.findById({_id: decodeData.id});
    console.log(req.user);

    next();
})

exports.authorizeRoles = (...roles) =>{
    return ( req, res ,next)=>{
        
        if(!roles.includes( req.user.role)){
            next( new ErrorHandler( 403, `Role: ${req.user.role} is not allowed to access this resource `), 403)
        }
        
        next();
    }
}