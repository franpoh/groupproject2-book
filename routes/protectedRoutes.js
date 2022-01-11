const express = require("express");
const router = express.Router();

const BookController = require ("../controllers/uploadController");

const bookController = new BookController();

router.post("/protected/uploadbook", bookController.uploadbook);

module.exports = router;