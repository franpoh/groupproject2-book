const express = require("express");
const router = express.Router();

const AccessController = require("../controllers/accessController");
const SearchController = require("../controllers/searchController");

const searchController = new SearchController();
const accessController = new AccessController();


router.post("/general/register", accessController.register);
router.post("/general/login", accessController.login);
router.get("/general/search", searchController.search); 


module.exports = router;
