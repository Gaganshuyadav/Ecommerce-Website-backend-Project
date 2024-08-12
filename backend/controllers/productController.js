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
exports.getAllProducts = catchAsyncErrors( async ( req, res, next)=>{

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
exports.updateProduct = catchAsyncErrors( async ( req, res, next)=>{
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

exports.deleteProduct = catchAsyncErrors ( async ( req, res, next) =>{
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

// Create New Review or Update the review
exports.createProductReview = catchAsyncErrors( async ( req, res, next)=>{
    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating,
        comment,
    }

    const product = await Product.findById(productId);
    
    const isReviewed = product.reviews.find( (rev)=>{
        return rev.user._id.toString() === req.user._id.toString();                  // we have to convert both to the string because of their reference-based nature.( objects are typically assessed for deep equality. it means that when we used to compare objects, it checks if the references point to the same object in memory).
    })

    //update review
    if(isReviewed){
        product.reviews.forEach((rev)=>{
            if( JSON.stringify(rev.user._id) === JSON.stringify(req.user._id)){
                rev.rating = review.rating;
                rev.comment = review.comment;
            }
        })
    }
    //add new review
    else{
        product.reviews.push( review);
        product.numOfReviews = product.reviews.length;   //length increases by 1
    }

    let totalRating = 0;
    product.reviews.forEach( (rev)=>{
          totalRating += rev.rating ;
    })
    product.ratings = totalRating/(product.reviews.length) ;

    await product.save();

    res.status(200).json({
        success: true,
    });

});

  
// Get All Reviews of a Product
exports.getProductReviews = catchAsyncErrors ( async( req, res, next)=>{
    
    const product = await Product.findById(req.query.productId);

    if(!product){
        return next( new ErrorHandler( 404, "Product Not Found"));
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews ,
    })
})

// Delete Review
exports.deleteReview = catchAsyncErrors ( async( req, res, next)=>{

    const product = await Product.findById( req.query.productId);
    
    if(!product){
        return next( new ErrorHandler( 404, "Product Not Found"));
    }

    const reviews = product.reviews.filter((rev)=>{
                        return rev._id.toString() !== req.query.reviewId.toString();
                    })

    product.reviews = reviews;

    let totalRating=0;
    reviews.forEach((rev)=>{
        totalRating += rev.rating ;
    })
    product.ratings = totalRating/(reviews.length);

    product.numOfReviews = reviews.length;

    await product.save();

    res.status( 200).json({
        success: true,
    })

})







