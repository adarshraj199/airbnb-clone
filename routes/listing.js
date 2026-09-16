const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listings.js");
const {isLoggedIn , isOwner , validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js")
const multer  = require('multer');
const {storage} = require("../cloudinary.js");
const upload = multer({ storage });


//index route

router.get("/" , wrapAsync(listingController.index));


//search
router.get("/search" , wrapAsync(listingController.searchListings));

//new route 
router.get("/new" , isLoggedIn , listingController.newroute);

//show route
router.get("/:id" , wrapAsync(listingController.showroute));


//create route
router.post("/",  upload.single('listing[image]'),validateListing , isLoggedIn, wrapAsync(listingController.createroute));



//edit route
router.get("/:id/edit" , isLoggedIn , isOwner,wrapAsync(listingController.editroute));

//update route
router.put("/:id" ,isLoggedIn,upload.single('listing[image]'), validateListing, isOwner, wrapAsync(listingController.updateroute));


//delete route
router.delete("/:id" , isLoggedIn ,isOwner , wrapAsync(listingController.deleteroute));


module.exports = router ;
