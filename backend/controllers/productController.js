const Product = require("../models/productModel.js");
const ErrorHandler = require("../utils/errorHandler.js");
const catchAsyncErrors = require("../middleware/catchAsyncErrors.js");
const ApiFeature = require("../utils/apifeatures.js");
const cloudinary = require("cloudinary").v2;


// Create Product  --Admin
exports.createProduct = catchAsyncErrors( async ( req,res,next)=>{
    
    req.body.user = req.user.id;                   // add admin who are created the product
    
    //identify how many images are received
    let images=[];
    if((typeof req.body.images)==="string"){
        images.push(req.body.images);
    }
    else{
        images = req.body.images;
    }

    const imagesLinks=[];
    //upload image in cloudinary one by one
    for(let image of images){

        const myCloud = await cloudinary.uploader.upload(image , {
            folder: "/Ecommerce-100-3/products",
        });

        imagesLinks.push({ 
            public_id: myCloud.public_id, 
            url: myCloud.secure_url
        });
        
    }

    //initialize array
    req.body.images = imagesLinks;

    const product = await Product.create( req.body);
    console.log(product)
    
    res.status(200).json({
        success:true,
        product
    })
})

// Get All Product 
exports.getAllProducts = catchAsyncErrors( async ( req, res, next)=>{
  
    // return next( new ErrorHandler(500, "this is created by user"));
    // console.log(req.query);

    // count documents
    const productCount = await Product.countDocuments();
   
    // api features
    const apifeatures = new ApiFeature( Product ,req.query).search().filter();

    //------------------//just for filters count---------------------------------
    // count after filteration of products
    const filterfeatures = new ApiFeature( Product ,req.query).search().filter();
    let products = await filterfeatures.query;
     filteredProductsCount = products.length;
    //---------------------------------------------------

    // search feature , filter feature and pagination feature
    const resultPerPage=8;
    apifeatures.pagination(resultPerPage);
   
    // find all products
    products = await apifeatures.query;


    res.status(200).json({
        success:true,
        products,
        productCount,
        resultPerPage,
        filteredProductsCount,
    });


       
    //-------------------------------------------------------------------------------------------------
    // req.query = { keyword: "e", page:2, limit:10, category:"technology",price:{gt:5000,lt:50000}};
    // 1. await Product.find(req.query);
    // 2. await Product.find({name:"gagam",age:21});
    // 3. await Product.find().where("name").equals("gagan").where(age).equals(21);

    //ShortCut for filtering in just one line(logic is just do)
    // const await Product.find(req.query.keyword).find(fiterResult).skip(skip).limit(resultPerPage);
    //-------------------------------------------------------------------------------------------------
   

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


// Get All Products --Admin 
exports.getAdminProducts = catchAsyncErrors( async ( req, res, next)=>{

    const products = await Product.find();
  
    res.status(200).json({
        success:true,
        products,
    });

})



// Update Product --Admin
exports.updateProduct = catchAsyncErrors( async ( req, res, next)=>{

    const find = await Product.findById(req.params.id);
    
    if(!find){
       return next( new ErrorHandler( 500, "Product Not Found"))
    }

    // Delete old Images from Cloudinary before update
    for(let image of find.images){
        const result = await cloudinary.uploader.destroy( image.public_id);
    }

    // receive images from request[ can be string or array according to forData]
    let images = [];
    if( (typeof req.body.images)==="string"){
        images.push(req.body.images);
    }
    else{
        images = req.body.images;
    }


    // upload new images in Cloudinary and store all links in array
    const imagesLinks=[];
    for(let image of images){

        const result = await cloudinary.uploader.upload( image , {
            folder: "/Ecommerce-100-3/products",
        });

        imagesLinks.push( { public_id: result.public_id, url: result.secure_url})
    }

    //add all image links into request
    req.body.images = imagesLinks;

    //update the database
    const product = await Product.findByIdAndUpdate( req.params.id ,req.body,{ new:true,runValidators:true});

    res.status(200).json({
        success:true,
        product
    })

})

// Delete Product --Admin

exports.deleteProduct = catchAsyncErrors ( async ( req, res, next) =>{

    const find = await Product.findById(req.params.id);

    if(!find){
       return next( new ErrorHandler( 500, "Product Not Found"))
    }

    //Deleting Images From Cloudinary
    for(let i=0;i< find.images.length; i++){
        const result = await cloudinary.uploader.destroy(find.images[i].public_id);
    }

    const product = await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success:true,
        message:"Product Deleted Successfully"
    })
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

    try{
        await product.save();
    }
    catch(err){
        console.log(err);
    }

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







