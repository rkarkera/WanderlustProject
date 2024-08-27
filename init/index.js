const mongoose = require('mongoose');
const Listing = require("../models/listings.js");
const initdata = require("./data.js");



main().then(() => {
    console.log("Database working");
}).catch((err) => {
    console.log(err);
})

async function main() {
  await mongoose.connect("mongodb+srv://rachankarkera300:C8PCmPwk0fZBtHEZ@cluster0.oxckc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"); 
}



const listdata = async () => {
   await Listing.deleteMany({});
   initdata.data = initdata.data.map((obj) => ({...obj,owner : "66bc924450e78a928d9314cd"}));
   await Listing.insertMany(initdata.data);
   console.log("Data inserted");
}

listdata();