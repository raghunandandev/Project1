if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();

const mongoose = require("mongoose");

//const Listing = require("./models/listing.js");
//const Review = require("./models/review.js");

const path = require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.urlencoded({extended:true}));

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

const ejsMate = require("ejs-mate");
app.engine("ejs",ejsMate);

app.use(express.static(path.join(__dirname,"public")));

//const wrapAsync = require("./utils/wrapAsync.js");

const ExpressError = require("./utils/ExpressError.js");

//const {listingSchema} = require("./schema.js");
//const {reviewSchema} = require("./schema.js");

//passport
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

//express router
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

//express session
const session = require("express-session");
const flash = require("connect-flash");

//connect-mongo
const MongoStore = require("connect-mongo");

//const monogoURL = 'mongodb://127.0.0.1:27017/Wander';
const dbURL = process.env.ATLASDB_URL;
main().then((res)=>{
    console.log("Connected to database successfully");
})
.catch((err)=>{
    console.log("Error");
})

async function main(){
    await mongoose.connect(dbURL);
}

const port = 7070;

const store = MongoStore.create({
    mongoUrl : dbURL,
    crypto : {
        secret: process.env.SECRET,
    },
    touchAfter : 24 * 3600,
});
store.on("error",()=>{
    console.log("Error in mongo session store",error);
})
const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires : Date.now() + 7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        httpOnly : true,
    }
}

// app.get("/",(req,res)=>{
//     res.send("We are on root . Every thing is alright :------>");
// });


app.use(session(sessionOptions));
app.use(flash());

//since passport also uses sessions ,therefore passport related code is written after 
//the session options
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;//req.user stores the info of curr user 
    next();
})

//creating a demo user
// app.get("/demoUser",async (req,res)=>{
//     let fakeUser = new User({
//         email:"radhe@gmail.com",
//         username:"radhe_bhai",
//     });
//     let registeredUser = await User.register(fakeUser,"radhe@1234");
//     res.send(registeredUser);
// })

// const validateListing = (req,res,next)=>{
//     let {error} = listingSchema.validate(req.body);
//     let errMsg = error.details.map((el) => el.message).join(",");
//     if(error){
//         throw new ExpressError(400,errMsg);
//     }else{
//         next();
//     }
// }
// const validateReview = (req,res,next)=>{
//     let {error} = reviewSchema.validate(req.body);
//     //let errMsg = error.details.map((el) => el.message).join(",");
//     if(error){
//         throw new ExpressError(400,error);
//     }else{
//         next();
//     }
// }

//express Router
app.use("/listings",listingRouter);

// //index route

// app.get("/listings",wrapAsync(async (req,res,next)=>{
//     let allListings = await Listing.find({});
//     //console.log(allListings);
//     res.render("./listings/index.ejs",{allListings});
//     //res.send("fetched all listings from database");
// }))

// //create Route
// //sending get request to form
// app.get("/listings/new",(req,res)=>{
//     res.render("./listings/new.ejs");
//     //res.send("new create pg")
// })

// //post request from form
// app.post("/listings",
//     validateListing,wrapAsync(async (req,res,next)=>{

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
//     await newListing.save();
//     res.redirect("/listings");

// }))

// //edit
// app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
//     const {id} = req.params;
//     const listing = await Listing.findById(id);
//     res.render("./listings/edit.ejs",{listing});
// }))
// //update
// app.put("/listings/:id",validateListing,wrapAsync(async (req,res)=>{
//     if(!req.body.listing){
//         throw new ExpressError(400,"Send a valid data for listing");
//     }
//     const {id} = req.params;
//     await Listing.findByIdAndUpdate(id,{...req.body.listing});
//     res.redirect(`/listings/${id}`);
// }))
// //delete
// app.delete("/listings/:id",wrapAsync(async (req,res)=>{
//     const {id} = req.params;
//     await Listing.findByIdAndDelete(id);
//     res.redirect("/listings");
// }))


//Express Router for reviews
app.use("/listings/:id/reviews",reviewRouter);



// //Review Post Route
// app.post("/listings/:id/reviews",validateReview,wrapAsync(async (req,res)=>{
//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Review(req.body.review);

//     listing.reviews.push(newReview);

//     await newReview.save();
//     await listing.save();

//     res.redirect(`/listings/${listing._id}`);
// }))
// //Deleting reviews use mongo pull operator
// app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async (req,res)=>{
//     let {id,reviewId} = req.params;
//     await Listing.findByIdAndUpdate(id,{$pull : {reviews : reviewId}});
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect(`/listings/${id}`)
// }))

//User Router------------->
app.use("/",userRouter);


// //show route

// app.get("/listings/:id",wrapAsync(async (req,res)=>{
//     const {id} = req.params;
//     const listing = await Listing.findOne({_id :id}).populate("reviews");
//     console.log(listing);
//     res.render("./listings/show.ejs",{listing});
//     // console.log(listing);
//     //res.send("Successfully reached to directed page");
// }))



// app.get("/testListings",async (req,res)=>{
//     const listing1 = new Listing({
//         title:"Chandel Industries Ltd.",
//         description:"Leading industries in the Asia",
        
//         price:345433443643,
//         location:"Bhadohi",
//         country:"India"
//     })
//     const savedData = await listing1.save();
//     console.log("data saved to db");
//     console.log(savedData);
//     res.send("Success , data stored");

// })

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
})

app.use((err,req,res,next)=>{
    const {statusCode=500,message="Something went wrong"} = err;
    //res.status(statusCode).send(message);
    //res.send("Something Went wrong!!!!!!!");
    console.log(err.stack);
    res.status(statusCode).render("./listings/error.ejs",{err});
})

app.listen(port,()=>{
    console.log(`listening on port ${port}`);
})