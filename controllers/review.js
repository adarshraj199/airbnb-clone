const Listing = require("../models/listings.js");
const Review = require("../models/review.js");

module.exports.reviewPostRoute = async(req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("new review saved");
      req.flash("sucess" ," new review created sucessfully");
    res.redirect(`/listings/${listing._id}`);
};


module.exports.reviewDeleteRoute = async(req,res)=> {
    let {id , reviewId} = req.params;

    await Listing.findByIdAndUpdate(id , {$pull: {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
      req.flash("sucess" ," review deleted sucessfully");
    res.redirect(`/listings/${id}`);
};