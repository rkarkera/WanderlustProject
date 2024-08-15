const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview,isLogged,reviewOwner} = require("../middleware.js");
const ReviewController = require("../controller/review.js");


//post review
router.post("/",isLogged,validateReview,wrapAsync(ReviewController.createReview));

//Delete Review
router.delete("/:reviewid",isLogged,reviewOwner,wrapAsync(ReviewController.destroyReview));


module.exports = router;