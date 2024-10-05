const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");
module.exports.index = async (req,res,next)=>{
    let allListings = await Listing.find({});
    //console.log(allListings);
    res.render("./listings/index.ejs",{allListings});
    //res.send("fetched all listings from database");
}

module.exports.renderNewForm = (req,res)=>{
    // console.log(req.user);
    // if(!req.isAuthenticated()){
    //     req.flash("error","you must be logged in to add new listing");
    //      return res.redirect("/login");
    // }
    res.render("./listings/new.ejs");
    //res.send("new create pg")
}

module.exports.showListing = async (req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findOne({_id :id})
        .populate({
            path: "reviews",
            populate : {
                path: "author",
            },
        })
        .populate("owner");
    console.log(listing);
    if(!listing){
        req.flash("error","Listing you requested for, does not exist!");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs",{listing});
    // console.log(listing);
    //res.send("Successfully reached to directed page");
}

module.exports.createListing = async (req,res,next)=>{

    // try {
    //     let newListing = new Listing(req.body.listing);
    //     await newListing.save();
    //     res.redirect("/listings");
    
    // } catch (err) {
    //     next(err);
    // }
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send valid data for listing");
    // }
    //let newListing = new Listing(req.body.listing);
    // if(!req.body.listing[location]){
    //     throw new ExpressError(400,"Location not found");
    // }

    // let result = listingSchema.validate(req.body);
    // console.log(result);
    // if(result.error){
    //     throw new ExpressError(400,result.error);
    // }

    let url = req.file.path;
    let filename = req.file.filename;
    //console.log(url,"..",filename);
    
    let newListing = new Listing(req.body.listing);
    //console.log(newListing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    console.log(newListing);
    await newListing.save();
    req.flash("success","New Listing Added");
    res.redirect("/listings");

}

module.exports.renderEditForm = async (req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for, does not exist!");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    console.log(originalImageUrl,"--------------------------------------------------------");
    originalImageUrl= originalImageUrl.replace("/upload","/upload/w_250");//refer cloudinary image api
    res.render("./listings/edit.ejs",{listing,originalImageUrl});
}

module.exports.updateListing = async (req,res)=>{
    
    if(!req.body.listing){
        throw new ExpressError(400,"Send a valid data for listing");
    }

    const {id} = req.params;
    // let listing = await Listing.findById(id);

    // if(!listing.owner._id(res.locals.currUser._id)){
    //     req.flash("error","you do not have permission to edit this listing");
    //     return res.redirect(`/listings/${id}`);
    // }

    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;

    listing.image = {url,filename};
    await listing.save();
    }
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req,res)=>{
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
}