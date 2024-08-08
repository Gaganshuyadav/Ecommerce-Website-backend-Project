const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase =  require("./config/database.js");

//-------------------------------------------
// Handling Uncaught Exception ( this handler only handle those errors which are comes after this )
process.on("uncaughtException", (err)=>{
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to Uncaught Exception");
    process.exit(1);
})
//-------------------------------------------

//config
dotenv.config({path:"backend/config/config.env"});

//-------------------------------------------


//Connecting to database
connectDatabase();

// app.listen( process.env.PORT, ( req,res)=>{
//     console.log(`server is working on port ${process.env.PORT}`);
// })

//-------------------------------------------


const server= app.listen( process.env.PORT, ( req,res)=>{
    console.log(`server is working on port ${process.env.PORT}`);
})

//-------------------------------------------

// ----- if the mongodb connection link is incorrect then this will use as catch() --[ when Promise is rejected ]-- and error then the server will never stop, so we need  to stop the server or crash the server.

// Unhandled Promise Rejection 

process.on("unhandledRejection", (err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);

    server.close(()=>{
        process.exit(1);
  });
})


