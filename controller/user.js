const User = require("../models/users.js");

module.exports.signupForm = (req,res) => {
    res.render("users/signup.ejs");
}

module.exports.userDatabase = async (req,res) => {
    try {
    let {username,password,email} = req.body;
    let newUser  = new User({
       email,
        username 
    });
    let user = await User.register(newUser,password);
    console.log(user);
    req.login(user,(err) => {
        if(err) {
            return next(err);
        } else {
            req.flash("success","Welcome to Wanderlust");
            res.redirect("/listings");
        }
    })
    
} catch(err) {
    req.flash("error",err.message);
    res.redirect("/signup");
}
}

module.exports.loginPage = (req,res) => {
    res.render("users/login.ejs")
}

module.exports.loginRequest = async(req,res) => {
    req.flash("success","Welcome to WanderLust");
    let path = res.locals.originalUrl || "/listings";
    res.redirect(path);
}

module.exports.logoutRequest = (req,res) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        } else {
            req.flash("success","You are logged out!");
            return res.redirect("/listings");
        }
    })
}