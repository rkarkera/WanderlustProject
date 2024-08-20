const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLogged,isOwner,validateListing} = require("../middleware.js");
const ListingController = require("../controller/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudinaryConfig.js");
const upload = multer({storage});
const Listing = require("../models/listings.js");


//index route //post
router.route("/")
.get(ListingController.index)
.post(isLogged,upload.single('listing[image]'),validateListing,wrapAsync(ListingController.addListingDatabase));

//create route
router.get("/new",isLogged,ListingController.createForm);

//search route
router.get("/search",isLogged,wrapAsync(ListingController.listingSearch));

//show route //update post //delete
router.route("/:id")
.get(wrapAsync(ListingController.showListing))
.put(isLogged,isOwner,upload.single('listing[image]'),wrapAsync(ListingController.updateListingDatabase))
.delete(isLogged,isOwner,wrapAsync(ListingController.destroyListingDatabase));

//update Form
router.get("/:id/edit",isLogged,isOwner,wrapAsync(ListingController.updateListingForm));

//index category
router.get("/:str/category",wrapAsync(ListingController.listingCategory));

module.exports = router;