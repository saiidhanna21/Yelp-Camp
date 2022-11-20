const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/catchAsync");
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');
const { addReview, deleteReview } = require("../controllers/reviews");

router.post("/",isLoggedIn,validateReview,wrapAsync(addReview));

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(deleteReview));

module.exports = router;
