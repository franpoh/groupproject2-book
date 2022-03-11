const express = require("express");
const router = express.Router();

const AccessController = require("../controllers/access-controller");
const SearchController = require("../controllers/search-controller");

const searchController = new SearchController();
const accessController = new AccessController();

// registration, login and logout
router.post("/general/register", accessController.register);
router.post("/general/login", accessController.login);
router.post("/general/logout", accessController.logout);

router.get("/general/search", searchController.search);

router.get("/general/detail", searchController.detail);
router.get("/general/searchIndex", searchController.searchIndex);
router.post("/general/searchIndexByParams", searchController.searchIndexByParams);
router.get("/general/searchSwap", searchController.searchSwapByIndex);
router.get("/general/reviews", searchController.allReviews);
router.get("/general/genres", searchController.searchGenres);


module.exports = router;
