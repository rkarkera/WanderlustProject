const mongoose = require('mongoose');
const Review = require("./reviews.js");

const listingSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
    },
    image : {
        url : String,
        filename : String
     },
    price : {
        type : Number,
        default:0
    },
    location : {
        type : String,
    },
    country : {
        type : String,
    },
    reviews : [
       {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Review"
       }
    ],
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    geometry : {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          
        },
        coordinates: {
          type: [Number],
          
        }
      },
      category : {
        type : String,
        enum : ["trending","rooms","iconic-cities","mountains","castles","amazing-pools","camping","farms","arctic","beaches",null]
      }
    
});


listingSchema.post("findOneAndDelete",async(listing) => {
    if(listing) {
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
});
const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;