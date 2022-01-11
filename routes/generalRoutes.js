const express = require("express");
const router = express.Router();

const AccessController = require("../controllers/accessController");
const SearchController = require("../controllers/searchController");

const searchController = new SearchController();
const accessController = new AccessController();


router.post("/register", accessController.register);
router.post("/login", accessController.login);
router.get("/search", searchController.search);

module.exports = router;
