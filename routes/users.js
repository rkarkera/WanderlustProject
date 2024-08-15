const express = require("express");
const router = express.Router();
const passport = require("passport");
const {saveOriginalUrl,validateSignup} = require("../middleware.js");

const UsersController = require("../controller/user.js");

router.route("/signup")
.get(UsersController.signupForm)
.post(validateSignup,UsersController.userDatabase);


router.route("/login")
.get(UsersController.loginPage)
.post(saveOriginalUrl,passport.authenticate('local', { failureRedirect: '/login' ,failureFlash:true}), UsersController.loginRequest);


router.get("/logout",UsersController.logoutRequest);

module.exports = router;