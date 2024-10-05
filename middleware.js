const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req,res,next)=>{
    console.log(req.originalUrl);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in");
        return res.redirect("/login");
    }
    next();
}
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        //passport removes all session data after login therefore we need to store the original path
        
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next)=>{
    const {id} = req.params;
    let listing = await Listing.findById(id);

    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","you do not have permission to perform this action");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    //let errMsg = error.details.map((el) => el.message).join(",");
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    //let errMsg = error.details.map((el) => el.message).join(",");
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}

module.exports.isReviewAuthor = async (req,res,next)=>{
    const {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);

    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","you do not have permission to perform this action");
        return res.redirect(`/listings/${id}`);
    }
    next();
}