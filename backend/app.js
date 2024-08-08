const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

//---------------------------------------------------
const errorMiddleware = require("./middleware/error.js");
//---------------------------------------------------

app.use(express.json());
app.use(cookieParser());                   //cookieParser is needed to parse or read the cookies from request

//---------------------------------------------------

//Route Imports
const product = require("./routes/productRoute.js");
const user = require("./routes/userRoute.js");

app.use("/api/v1", product);

app.use("/api/v1", user);

//---------------------------------------------------

// Middleware for Errors
app.use( errorMiddleware);

//---------------------------------------------------

module.exports = app;