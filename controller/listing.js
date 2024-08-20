const Listing = require("../models/listings.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req,res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}

module.exports.createForm = (req,res) => {
    res.render("./listings/new.ejs");
}

module.exports.addListingDatabase = async (req,res,next) => {     
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send();
        
    let url = req.file.path;
    let filename = req.file.filename;
    let newList = new Listing(req.body.listing);
    newList.owner = req.user._id;
    newList.image = {url,filename};
    newList.geometry = response.body.features[0].geometry;
     let list = await newList.save();
     console.log(list);
    req.flash("success","New Listing Created");
    res.redirect("/"); 
}

module.exports.showListing = async (req,res) => {
    let {id} = req.params;
    let data = await Listing.findById(id).populate({path : "reviews",populate:{path : "author"}}).populate("owner");
    if(!data) {
     req.flash("error","Listing not found!");
     res.redirect("/");
    } else {
    res.render("./listings/show.ejs",{data});
    }
 }

 module.exports.updateListingForm = async(req,res) => {
    let {id} = req.params;
    let listdata = await Listing.findById(id);
    if(!listdata) {
     req.flash("error","Listing not found!");
     res.redirect("/");
    }
    let originalUrl = listdata.image.url;
    originalUrl = originalUrl.replace("/upload","/upload/c_fill,h_200,w_250");
    res.render("./listings/edit.ejs",{listdata,originalUrl});
 }

 module.exports.updateListingDatabase = async(req,res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(req.file) {
        let url = req.file.path;
        let filename = req.file.filename; 
        listing.image = {url,filename};
        await listing.save();
    }
    req.flash("success","Listing is edited");
    res.redirect(`/${id}`);
 }

 module.exports.destroyListingDatabase = async(req,res) => {
    let {id} = req.params;
    let deleteData = await Listing.findByIdAndDelete(id);
    console.log(deleteData);
    req.flash("success","Listing is deleted");
    res.redirect("/");  
}

module.exports.listingCategory = async(req,res) => {
    let {str} = req.params;
    const allListings = await Listing.find({});
    res.render("./listings/category.ejs",{allListings,str});
}

module.exports.listingSearch = async(req,res) => {
    let {key} = req.query;
    let allListings = await Listing.find(
        {
           "$or":[
             {"country":{$regex:key, $options: "i"}},
             {"location":{$regex:key, $options: "i"}},
             {"category":{$regex:key, $options: "i"}},
           ]
    }
)
res.render("listings/index.ejs",{allListings});
}