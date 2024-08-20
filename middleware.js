const Listing = require("./models/listings.js");
const {ListingSchema,ReviewSchema,SignUpSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/reviews.js");

module.exports.isLogged = (req,res,next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be loggedIn to create listings!")
         return res.redirect("/login");
    }
    next();  
}

module.exports.saveOriginalUrl = (req,res,next) => {
    if(req.session.redirectUrl) {
    res.locals.originalUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(req.user._id)) {
        req.flash("error","You are not an  owner");
        return res.redirect(`/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next) => {
    let result = ListingSchema.validate(req.body);
    if(result.error) {
        throw new ExpressError(400,result.error);
    } else {
        next();
    }
}

module.exports.validateReview = (req,res,next) => {
    let result = ReviewSchema.validate(req.body);
    if(result.error) {
        throw new ExpressError(400,result.error);
    } else {
        next();
    }
}

module.exports.reviewOwner = async (req,res,next) => {
    let {id,reviewid} = req.params;
    let review = await Review.findById(reviewid);
    if(!review.author.equals(res.locals.user._id)) {
       req.flash("error","You are not the author of this review");
       return res.redirect(`/${id}`);
    }
    next();
 
}

module.exports.validateSignup = (req,res,next) => {
    let result = SignUpSchema.validate(req.body);
    if(result.error) {
        req.flash("error",result.error.message);
        res.redirect("/signup");
    } else {
        next();
    }
}