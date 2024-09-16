const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler.js");
const catchAsyncErrors = require("../middleware/catchAsyncErrors.js");

// Create New Order
exports.newOrder = catchAsyncErrors( async ( req, res, next)=>{

    console.log(req.body);
    const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice} = req.body;

    const order = await Order.create({
        shippingInfo, 
        orderItems,
        user: req.user._id, 
        paymentInfo, 
        paidAt: Date.now(),
        itemsPrice, 
        taxPrice, 
        shippingPrice, 
        totalPrice,
    });

    res.status(200).json({
        success: true,
        order,
    }) 

})

// get Single Order 
exports.getSingleOrder = catchAsyncErrors( async ( req, res, next)=>{

    const order = await Order.findById( req.params.id).populate( "user", "name email");

    if(!order){
        return next( new ErrorHandler( 404, "order not found with this Id"));
    }

    res.status(200).json({
        success: true,
        order,
    })
})


// get logged in user Orders
exports.myOrders = catchAsyncErrors( async ( req, res, next)=>{

    const orders = await Order.find({ user: req.user._id});

    if(!orders){
        return next( new ErrorHandler( 404, "orders not found"));
    }

    res.status(200).json({
        success: true,
        orders,
    })
})

// get all Orders --Admin
exports.getAllOrders = catchAsyncErrors( async( req, res, next)=>{

    const orders = await Order.find();

    let totalAmount = 0;
    orders.forEach((order)=>{
        totalAmount += order.totalPrice;
    })

    if(!orders){
        return next( new ErrorHandler( 404, "orders not found"));
    }

    res.status(200).json({
        success: true,
        totalAmount,
        orders,
    })
})

// update Order status -- Admin
exports.updateOrder = catchAsyncErrors( async( req, res, next)=>{

    const order = await Order.findById( req.params.id);
    console.log(req.body);

    if( order.orderStatus === "Delivered"){
        return next( new ErrorHandler( 400, "You have already delivered this order"))
    }


    if(req.body.status==="Shipped"){

        order.orderItems.forEach( async (item)=>{

        const product = await Product.findById( item.productId._id);
        product.Stock = product.Stock - item.quantity;
        await product.save({ validateBeforeSave: false});
    })  

    }
    

    order.orderStatus = req.body.status;

    if(req.body.status === "Delivered"){
        order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false});

    res.status(200).json({
        success: true,
    })


}) 


// Delete Order -- Admin
exports.deleteOrder = catchAsyncErrors( async( req, res, next)=>{

    const order = await Order.findById( req.params.id);

    if(!order){
        return next( new ErrorHandler( 404 ,"order not found with this Id"))
    }

    await Order.findByIdAndDelete( req.params.id);

    res.status(200).json({
        success: true,
    });
})


















