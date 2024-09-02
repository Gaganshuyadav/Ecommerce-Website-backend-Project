// Create Token and saving in (cookie or localStorage)



const sendToken = async ( user, statusCode, res)=>{
    const token = await user.getJWTToken();
    
    // use localStorage for token    
    res.json({
        success: true,
        user,
        token
    })

}

module.exports = sendToken;










 // options for cookie ( this is not supported for differnt domains(i can use it have i use same domains))
    // const options = {
    //     expires: new Date( 
    //         Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    //     ),
    //     maxAge: new Date( 
    //         Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    //     ),
    //     httpOnly: true,      //protect against XSS(cross-site scripting)
    //     sameSite: 'lax',
    //     // secure: true,
    //     domain: 'http://localhost:5173/login',

    // };
    

    // res.cookie( "token", token, options).json({
    //     success: true,
    //     user,
    //     token
    // })