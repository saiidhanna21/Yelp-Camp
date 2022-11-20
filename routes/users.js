const express = require('express');
const passport = require('passport');
const router = express.Router();
const wrapAsync = require('../utils/catchAsync')
const users = require('../controllers/users');
const { checkReturnTo } = require('../controllers/campgrounds'); 

router.route('/register')
    .get(users.renderRegister)
    .post( wrapAsync(users.register))

router.route("/login")
    .get(users.renderLogin)
    .post(checkReturnTo,passport.authenticate("local", { failureFlash: true, failureRedirect: "/login"}), users.login);

router.get('/logout', users.logout);

module.exports = router;