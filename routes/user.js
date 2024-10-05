const express = require("express");
const router = express.Router({mergeParams : true});
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controller/users.js");

//creating router.route
router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));


router.route("/login")
    .get(userController.renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local",{
            failureFlash : true,
            failureRedirect:"/login",
        }),
        userController.login
    );

router.get("/logout",userController.logout);    

//signup
// router.get("/signup",userController.renderSignupForm);

//signup post
// router.post("/signup",wrapAsync(userController.signup));

//login
// router.get("/login",userController.renderLoginForm);

//login check
// router.post("/login",
//     saveRedirectUrl,
//     passport.authenticate("local",{
//         failureFlash : true,
//         failureRedirect:"/login",
//     }),userController.login);

//logout
// router.get("/logout",userController.logout);    

// router.get("/signup",(req,res)=>{
//     res.render("./users/signup.ejs");
// })

// router.post("/signup",wrapAsync(async (req,res)=>{
//     try {
//         let {username,email,password} = req.body;
//         const newUser = new User({email,username});
//         let registeredUser = await User.register(newUser,password);
//         console.log(registeredUser);
//         req.login(registeredUser,(err)=>{
//             if(err){
//                 next(err);
//             }
//             req.flash("success","Registration Successfull");
//             res.redirect("/listings");
//         })
        
//     } catch (error) {
//         req.flash("error",error.message);
//         res.redirect("/signup");
//     }

//     // let {username,email,password} = req.body;
//     // const newUser = new User({email,username});
//     // let registeredUser = await User.register(newUser,password);
//     // console.log(registeredUser);
//     // req.flash("success","Registration Successfull");
//     // res.redirect("/listings");
// }))

// router.get("/login",(req,res)=>{
//     res.render("./users/login.ejs");
// });
// router.post("/login",
//     saveRedirectUrl,
//     passport.authenticate("local",{
//         failureFlash : true,
//         failureRedirect:"/login",
//     }),
//     async (req,res)=>{
//         req.flash("success","Welcome back to Wander");
//         let redirectUrl = res.locals.redirectUrl || "/listings";
//         res.redirect(redirectUrl);
//     }
// );

// router.get("/logout",(req,res,next)=>{
//     req.logout((err)=>{
//         if(err){
//             return next(err);
//         }
//         req.flash("success","you are logged out");
//         res.redirect("/listings");
//     });
// });

module.exports = router;