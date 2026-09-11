const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listings.js");
const Review = require("../models/review.js")
const {validatereview , isLoggedIn , isReviewAuthor} = require("../middleware.js");




//reviews 
// review post route
router.post("/" , validatereview , isLoggedIn  ,wrapAsync(async(req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("new review saved");
      req.flash("sucess" ," new review created sucessfully");
    res.redirect(`/listings/${listing._id}`);
}));

//review delete route
router.delete("/:reviewId" , isLoggedIn, isReviewAuthor ,wrapAsync( async(req,res)=> {
    let {id , reviewId} = req.params;

    await Listing.findByIdAndUpdate(id , {$pull: {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
      req.flash("sucess" ," review deleted sucessfully");
    res.redirect(`/listings/${id}`);
}))

module.exports = router;