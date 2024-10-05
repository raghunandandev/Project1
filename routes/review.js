const express = require("express");
const router = express.Router({mergeParams : true});
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");
const {listingSchema} = require("../schema.js");
const {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js")

const reviewController = require("../controller/reviews.js");

// const validateReview = (req,res,next)=>{
//     let {error} = reviewSchema.validate(req.body);
//     //let errMsg = error.details.map((el) => el.message).join(",");
//     if(error){
//         throw new ExpressError(400,error);
//     }else{
//         next();
//     }
// }

//review post route
router.post("/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview));

//delete review
router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview));    


//Review Post Route
// router.post("/",isLoggedIn,validateReview,wrapAsync(async (req,res)=>{
//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Review(req.body.review);
//     newReview.author = req.user._id;//adding author to review
//     console.log(newReview);
//     listing.reviews.push(newReview);
//     console.log(req.user._id,"----------------------------------------------------------->");
//     await newReview.save();
//     await listing.save();
//     req.flash("success","New Review Added");
//     res.redirect(`/listings/${listing._id}`);
// }))
//Deleting reviews use mongo pull operator
// router.delete("/:reviewId",
//     isLoggedIn,
//     isReviewAuthor,
//     wrapAsync(async (req,res)=>{
//         let {id,reviewId} = req.params;
//         await Listing.findByIdAndUpdate(id,{$pull : {reviews : reviewId}});
//         await Review.findByIdAndDelete(reviewId);
//         req.flash("success","Review Deleted");
//         res.redirect(`/listings/${id}`)
//     })
// )

module.exports = router;