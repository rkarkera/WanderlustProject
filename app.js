if(process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/reviews.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const User = require("./models/users.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const usersRouter = require("./routes/users.js");
const wrapAsync = require('./utils/wrapAsync.js');


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname,"/public")));


const dburl = process.env.ATLAS_URL;

const store = MongoStore.create({
    mongoUrl: dburl,
    crypto: {
      secret: process.env.SECRET
    },
    touchAfter : 24 * 3600
  })
const sessionOptions =  {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true
    }
}

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


main().then(() => {
    console.log("Database working");
}).catch((err) => {
    console.log(err);
})

async function main() {
  await mongoose.connect(dburl); 
}

app.listen("8080",() => {
    console.log("Server Started");
})



app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.user = req.user;
    next();
})


app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",usersRouter);


app.all("*",(req,res,next) => {
    throw new ExpressError(404,"page not found");
})

app.use((err,req,res,next) => {
   let{status=500,message="Something went wrong"} = err;
   res.status(status).render("error.ejs",{message});
})








// app.get("/testingList",(req,res) => {
//     const list = new Listing({
//         title : "My Home",
//         description : "Want to sell",
//         price : 300000,
//         location : "Mumbai",
//         country : "India"
//     });

//     list.save().then(() => {
//         console.log("sucess");
//     }).catch((err) => {
//         console.log(err);
//     })
//     res.send("sample saved");
// })