const ErrorHandler = require("../utils/errorHandler");

module.exports = ( err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    
    // Wrong Mongodb Id error
    if(err.name=="CastError"){
        const message = `Resource not found. Invalid ${err.path}`;
        err = new ErrorHandler(400, message);
    }

    // Mongoose duplicate key errors
    if( err.code === 11000){
        const message = ` Duplicate ${object.keys(err.value)} Entered`;
        err = new ErrorHandler(400,message);
    }


    res.status(err.statusCode).json({
        success: false,
        Name: err.name,
        message: err.message,
        error: err.stack,
    });
};