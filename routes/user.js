const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { any } = require("joi");
const { savedRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

router.get("/signup" , userController.getsignup);

router.post("/signup" ,wrapAsync(userController.postSignup));

router.get("/login" ,userController.getLogin);

router.post("/login" ,
    savedRedirectUrl,
     passport.authenticate("local" 
    , {failureRedirect: "/login" 
        , failureFlash: true,}) , 
userController.postLogin);


router.get("/logout" , userController.logout);

module.exports = router;