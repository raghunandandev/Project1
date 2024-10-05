const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
// const {listingSchema} = require("../schema.js");
const {reviewSchema} = require("../schema.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controller/listings.js");

const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });



// const validateListing = (req,res,next)=>{
//     let {error} = listingSchema.validate(req.body);
//     //let errMsg = error.details.map((el) => el.message).join(",");
//     if(error){
//         throw new ExpressError(400,error);
//     }else{
//         next();
//     }
// }


//using router.route for more compact code
//combine same routes

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.createListing)
    );

router.get("/new",
    isLoggedIn,
    listingController.renderNewForm
);    

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
        isLoggedIn,
        isOwner,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.destroyListing)
    )

router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm)
);



// //index route
// router.get("/",wrapAsync(listingController.index));

// //Create route
// router.get("/new",
//     isLoggedIn,
//     listingController.renderNewForm
// );

//show route
// router.get("/:id",wrapAsync(listingController.showListing));

// //create route post
// router.post("/",
//     isLoggedIn,
//     validateListing,
//     wrapAsync(listingController.createListing));

//edit form 
// router.get("/:id/edit",
//     isLoggedIn,
//     isOwner,
//     wrapAsync(listingController.renderEditForm));

//update Listing
// router.put("/:id",
//     isLoggedIn,
//     isOwner,
//     validateListing,
//     wrapAsync(listingController.updateListing));

//delete listing
// router.delete("/:id",
//     isLoggedIn,
//     isOwner,
//     wrapAsync(listingController.destroyListing));

// router.get("/",wrapAsync(async (req,res,next)=>{
//     let allListings = await Listing.find({});
//     //console.log(allListings);
//     res.render("./listings/index.ejs",{allListings});
//     //res.send("fetched all listings from database");
// }))

//create Route
//sending get request to form
// router.get("/new",isLoggedIn,(req,res)=>{
//     // console.log(req.user);
//     // if(!req.isAuthenticated()){
//     //     req.flash("error","you must be logged in to add new listing");
//     //      return res.redirect("/login");
//     // }
//     res.render("./listings/new.ejs");
//     //res.send("new create pg")
// })

//post request from form
// router.post("/",
//     isLoggedIn,
//     validateListing,
//     wrapAsync(async (req,res,next)=>{

//     // try {
//     //     let newListing = new Listing(req.body.listing);
//     //     await newListing.save();
//     //     res.redirect("/listings");
    
//     // } catch (err) {
//     //     next(err);
//     // }
//     // if(!req.body.listing){
//     //     throw new ExpressError(400,"Send valid data for listing");
//     // }
//     //let newListing = new Listing(req.body.listing);
//     // if(!req.body.listing[location]){
//     //     throw new ExpressError(400,"Location not found");
//     // }

//     // let result = listingSchema.validate(req.body);
//     // console.log(result);
//     // if(result.error){
//     //     throw new ExpressError(400,result.error);
//     // }
    
//     let newListing = new Listing(req.body.listing);
//     //console.log(newListing);
//     newListing.owner = req.user._id;
//     console.log(newListing);
//     await newListing.save();
//     req.flash("success","New Listing Added");
//     res.redirect("/listings");

// }))

//edit
// router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
//     const {id} = req.params;
//     const listing = await Listing.findById(id);
//     if(!listing){
//         req.flash("error","Listing you requested for, does not exist!");
//         res.redirect("/listings");
//     }
//     res.render("./listings/edit.ejs",{listing});
// }))
//update
// router.put("/:id",
//     isLoggedIn,
//     isOwner,
//     validateListing,
//     wrapAsync(async (req,res)=>{
    
//         if(!req.body.listing){
//             throw new ExpressError(400,"Send a valid data for listing");
//         }
    
//         const {id} = req.params;
//         // let listing = await Listing.findById(id);

//         // if(!listing.owner._id(res.locals.currUser._id)){
//         //     req.flash("error","you do not have permission to edit this listing");
//         //     return res.redirect(`/listings/${id}`);
//         // }
//         await Listing.findByIdAndUpdate(id,{...req.body.listing});
//         req.flash("success","Listing Updated");
//         res.redirect(`/listings/${id}`);
// }))
//delete
// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
//     const {id} = req.params;
//     await Listing.findByIdAndDelete(id);
//     req.flash("success","Listing Deleted");
//     res.redirect("/listings");
// }))

//show route

// router.get("/:id",wrapAsync(async (req,res)=>{
//     const {id} = req.params;
//     const listing = await Listing.findOne({_id :id})
//         .populate({
//             path: "reviews",
//             populate : {
//                 path: "author",
//             },
//         })
//         .populate("owner");
//     console.log(listing);
//     if(!listing){
//         req.flash("error","Listing you requested for, does not exist!");
//         res.redirect("/listings");
//     }
//     res.render("./listings/show.ejs",{listing});
//     // console.log(listing);
//     //res.send("Successfully reached to directed page");
// }))

module.exports = router;