const express = require("express");
const router = express.Router();

const ReviewController = require("../controllers/reviewController");

const reviewController = new ReviewController();

router.post("/protected/:indexId/addReview", reviewController.addReview);


module.exports = router;