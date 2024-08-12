const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler.js");
const catchAsyncErrors = require("../middleware/catchAsyncErrors.js");
const sendToken = require("../utils/jwtToken.js");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail.js");

// register User( Signup User)

exports.registerUser = catchAsyncErrors( async ( req, res)=>{
    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id: "this is a sample id",
            url: "profilePicURL",
        },
    });

    sendToken( user, 200, res);
    
});

// Login User
exports.loginUser = catchAsyncErrors( async( req, res, next)=>{

    const { email, password} = req.body;

    // check if user has a given password and email both

    if( !email || !password){
        return next( new ErrorHandler( 400, "Please Enter Email and Password"));
    }

    const user = await User.findOne({ email}).select("+password");

    if(!user){
        return next( new ErrorHandler( 401, "Invalid Email or Password"));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler( 401, "Invalid email or password"));
    }

    sendToken( user, 201, res);

})

// Logout User
exports.logoutUser = catchAsyncErrors( async( req, res)=>{

    options = {
        expires: new Date( Date.now() ),
        httpOnly: true,
    }

    res.status(200).cookie("token", null, options).json({
        success: true,
        message:"Logged Out",
    });
})

// Forgot Password
exports.forgotPassword = catchAsyncErrors( async( req, res, next)=>{

    const { email} = req.body;

    const user = await User.findOne({email});

    if(!user){
        return next( new ErrorHandler(404, "User not found"));
    }

    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();
    // save the tokenResetPassoword and tokenResetPassowordExpireTime
    await user.save({validateBeforeSave: false});

    const resetPasswordUrl = `${ req.protocol}://${ req.get("host")}/api/v1/password/reset/${resetToken}`;
  
    const message = `Your password reset token is :- ${resetPasswordUrl} \n\n If you have not requested this email
        then, please ignore it `;

    try{
        await sendEmail({
            email: user.email ,
            subject: "Ecommerce Password Recovery",
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`
        })

    }
    catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        return next( new ErrorHandler( 500, error.message));
    }
})

// Reset Password
exports.resetPassword = catchAsyncErrors( async( req,res, next)=>{

    const { resetToken} = req.params;
    const { password, conformPassword} = req.body;

    if(!(password == conformPassword)){
        return next( new ErrorHandler( 400, "password and reset password does not match")); 
    }

    //creating token hash
    const passwordResetToken = crypto.createHash("sha256").update( resetToken).digest("hex");

    const user = await User.findOne({
        resetPasswordToken: passwordResetToken,
        resetPasswordExpire: {$gt: Date.now() }
    })

    if(!user){
        return next( new ErrorHandler(404, "Reset Password token is invalid or has been expired"));
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken( user, 200, res);
})

// Get User Detail
exports.getUserDetails = catchAsyncErrors( async( req, res, next)=>{

    const user = await User.findById(( req.user.id));

    res.status(200).json({
        success: true,
        user
    })
})

// update User password
exports.updatePassword = catchAsyncErrors( async( req, res, next)=>{

    const user = await User.findById( req.user.id).select("+password");
    
    const isPasswordMatched = await user.comparePassword( req.body.oldPassword);

    if(!isPasswordMatched){
        return next( new ErrorHandler( 401, "old password is incorrect"));
    }

    if(req.body.newPassword != req.body.conformPassword){
        return next( new ErrorHandler( 400, "password does not match"));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendToken( user, 200, res);

})

// update User Profile
exports.updateProfile = catchAsyncErrors( async ( req, res, next)=>{

    const newUserData = {
        name: req.body.name ,
        email: req.body.password
    };

    // this area is for cloudinary and used for user avatar
    
    const user = await User.findByIdAndUpdate( req.user.id , newUserData, {
        new: true,
        runValidators:true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
    })
})

// Get all users --(admin)
exports.getAllUsers = catchAsyncErrors( async( req, res, next)=>{

    const users = await User.find();

    res.status(200).json({
        success: true,
        users,
    })
})

// Get single user --(admin)
exports.getSingleUser = catchAsyncErrors( async( req, res, next)=>{

    const user = await User.findById( req.params.id);

    if(!user){
        return next( new ErrorHandler( 404, `User does not exist with Id: ${ req.params.id}`))
    }

    res.status(200).json({
        success: true,
        user,
    })
})

// update User Role --(admin)
exports.udpateUserRole = catchAsyncErrors( async( req, res, next)=>{

                                                                 // if any field is undefined , then this method not included the update object, and therefore not updated.( because it uses $set operator under the hood). 
    const userNewData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    }

    console.log(userNewData);

    const user = await User.findByIdAndUpdate( req.params.id, userNewData, {
        new: true,
        runValidators:true,
        useFindAndModify: false,
    })

    res.status(200).json({
        success: true,
        message: "user updated successfully",
    })
})

// Delete User --(admin)
exports.deleteUser = catchAsyncErrors( async( req, res, next)=>{

    const isUser = User.findById( req.params.id);

    if(!isUser){
        return next( new ErrorHandler( 404, `User does not exist with Id: ${req.params.is}`));
    }

    // i will remove cloudinary later

    const user = await User.findOneAndDelete( req.params.id);

    res.status(200).json({
        success: true,
        message: "user deleted successfully",
    })

})


