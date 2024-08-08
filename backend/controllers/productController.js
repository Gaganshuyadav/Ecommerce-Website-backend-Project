const Product = require("../models/productModel.js");
const ErrorHandler = require("../utils/errorHandler.js");
const catchAsyncErrors = require("../middleware/catchAsyncErrors.js");
const ApiFeature = require("../utils/apifeatures.js");

// Create Product  --Admin
exports.createProduct = catchAsyncErrors( async ( req,res,next)=>{
    
    req.body.user = req.user.id;                   // add admin who are created the product
    
    const product = await Product.create(req.body);

    res.status(200).json({
        success:true,
        product
    })
})

// Get All Product 
exports.getAllProducts = catchAsyncErrors( async ( req,res)=>{

    console.log("user comes from middleware ",req.user);


    //count 
    const productCount = await Product.countDocuments();
    console.log("---count--- ",productCount);

    
    // Example:- { keyword: "hai", page:2, limit:10, category:"technology",price:{gt:2000,lt:6000}}

    // api features
    const apifeatures = new ApiFeature( Product , req.query);

    // search feature
    const search = await apifeatures.search();
    console.log("---search--- ",search);  

    // filter feature
    const filter = await apifeatures.filter();
    console.log("---filter--- ",filter);

    // pagination feature
    const resultPerPage=3;
    const pagination = await apifeatures.pagination( resultPerPage);
    console.log("---pagination--- ",pagination);

    // find all products
    const products = await Product.find();
    res.status(200).json({
        success:true,
        products,
        productCount
    });
})

// Get Single Product

exports.getSingleProduct = catchAsyncErrors( async ( req, res, next)=>{
    const product = await Product.findById(req.params.id);

    if(!product){

        return next( new ErrorHandler( 500, "Product Not Found"))
    }
    else{

    res.status(200).json({
        success:true,
        product
    })
    }
})


// Update All Product --Admin
exports.updateProduct = catchAsyncErrors( async (req,res)=>{
    const find = await Product.findById(req.params.id);
    console.log("find ",find);
    if(!find){

       return next( new ErrorHandler( 500, "Product Not Found"))
    }
    else{
    const product = await Product.findByIdAndUpdate( req.params.id ,req.body,{ new:true,runValidators:true});

    res.status(200).json({
        success:true,
        product
    })
    }

})

// Delete Product --Admin

exports.deleteProduct = catchAsyncErrors ( async (req,res) =>{
    const find = await Product.findById(req.params.id);
    if(!find){

       return next( new ErrorHandler( 500, "Product Not Found"))
    }
    else{
        const product = await Product.findByIdAndDelete(req.params.id);
        
        res.status(200).json({
            success:true,
            message:"Product Deleted Successfully"
        })
    }
})



