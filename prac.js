// let student = {
//     name : "Rachan",
//     roll : 58,
//     school : "G R Patil"
// };

// let rachan = {city : "Mumbai",...student};

// console.log(rachan);
const Listing = require("./models/listings.js");
const mongoose = require('mongoose');

main().then(() => {
    console.log("Database working");
}).catch((err) => {
    console.log(err);
})

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust1'); 
}

const update = async() => {
    let str = "iconic-cities";
    let id = "66ba1c17dad55b337fb84556";
   let List = await Listing.findByIdAndUpdate(id,{category:str});
   console.log(List);
}

update();