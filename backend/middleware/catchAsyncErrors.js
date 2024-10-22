

module.exports = (fn)=>{
    return function( req, res, next){
        fn( req, res, next).catch((err) => next(err));
    }
}


//the middle function acts as a promise resolver:--

// module.exports = (fn)=>{
//     Promise.resolve( fn( req,res,next)).catch(next);
// };