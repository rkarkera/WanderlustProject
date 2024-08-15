const Listing = require("../models/listings.js");
const Review = require("../models/reviews.js");

module.exports.createReview = async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    
    let review = new Review(req.body.review);
    review.author = req.user._id;
    
    listing.reviews.push(review);

    await review.save();
    await listing.save();
    req.flash("success","Review is saved");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyReview =  async (req,res) => {
    let{id,reviewid} = req.params;
    await Review.findByIdAndDelete(reviewid);
    await Listing.findByIdAndUpdate(id,{$pull : {reviews : reviewid}});
    req.flash("success","Review is deleted");
    res.redirect(`/listings/${id}`);
}