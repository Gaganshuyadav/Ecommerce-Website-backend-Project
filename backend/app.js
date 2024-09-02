const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");

//---------------------------------------------------
const errorMiddleware = require("./middleware/error.js");
//---------------------------------------------------

app.use(express.json());                          // [ "Content-Type":"application/json"] and all it puts the parsed data in req.body ( otherwise req.body is undefined)
app.use(cookieParser());                          // cookieParser is needed to parse or read the cookies from request

// app.use(cors());                               // cors is used to safe the frontend from cross-origin error( and we can also use Proxy in vite.config and also we can write at the package.json) [this needed to get response data]
app.use((req,res,next)=>{                         // instead of cors middleware we can do it by ourselves
    res.header('Access-Control-Allow-Origin',"*");
    res.header('Access-Control-Allow-Methods','GET , POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers','Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials','true');
    res.header('Access-Control-Max-Age','3600');
    next();
})                         

app.use(fileUpload());                            // [ "Content-Type":"multipart/form-data"] :-  this middleware parse the formData object sent form the client-side and we can use (multer) as well( otherwise req.body is empty)
app.use(express.urlencoded({ extended: true}));   // [ "Content-Type":"application/x-www-form-urlencoded"]  this middleware parse the URL-encoded data sent in the req.body ( it is commonly used for traditional HTML forms.

//---------------------------------------------------

//Route Imports
const product = require("./routes/productRoute.js");
const user = require("./routes/userRoute.js");
const order = require("./routes/orderRoute.js");

app.use("/api/v1", product);

app.use("/api/v1", user);

app.use("/api/v1", order);

//---------------------------------------------------

// Middleware for Errors
app.use( errorMiddleware);

//---------------------------------------------------

module.exports = app;