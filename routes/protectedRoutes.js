const express = require("express");
const router = express.Router();

const BooksController = require("../controllers/booksController");

const booksController = new BooksController();

router.post("/protected/:indexId/addReview", booksController.addReview);



module.exports = router;