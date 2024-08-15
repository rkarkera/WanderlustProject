const mongoose = require('mongoose');
const Listing = require("../models/listings.js");
const initdata = require("./data.js");

main().then(() => {
    console.log("Database working");
}).catch((err) => {
    console.log(err);
})

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust1'); 
}


const listdata = async () => {
   await Listing.deleteMany({});
   initdata.data = initdata.data.map((obj) => ({...obj,owner : "66a885e108518a90711680bb"}));
   await Listing.insertMany(initdata.data);
   console.log("Data inserted");
}

listdata();