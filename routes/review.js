const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listings.js");
const Review = require("../models/review.js")
const {validatereview , isLoggedIn , isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");




//reviews 
// review post route
router.post("/" , validatereview , isLoggedIn  ,wrapAsync(reviewController.reviewPostRoute));

//review delete route
router.delete("/:reviewId" , isLoggedIn, isReviewAuthor ,wrapAsync(reviewController.reviewDeleteRoute));

module.exports = router;