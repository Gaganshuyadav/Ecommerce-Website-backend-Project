const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthenticatedUser = catchAsyncErrors( async( req, res, next)=>{
    
    // const {token} = req.cookies;                  //now we are not using cookies to store token 

    let token;
    if(req.headers.authorization){
        token = req.headers.authorization.split(" ")[1];
    }
    else{
        token = false;
    }

    if(!token){
       next( new ErrorHandler( 401, " Please Login to access this resource"));
    }

    const decodeData = jwt.verify( token, process.env.JWT_SECRET);

    req.user = await User.findById({_id: decodeData.id});

    next();
})

exports.authorizeRoles = (...roles) =>{                                              //function always have an invisible array
    return ( req, res ,next)=>{
        
        if(!roles.includes( req.user.role)){
            next( new ErrorHandler( 403, `Role: ${req.user.role} is not allowed to access this resource `), 403)
        }
        
        next();
    }
}