const express = require("express");
const router = express.Router();

const AccountController = require("../controllers/accountController");
const SearchController = require("../controllers/searchController");

const authenticateJwt = require("../authentication/authJwt");

const accountController = new AccountController();
const searchController = new SearchController();


router.post("/register", accountController.register);
router.post("/login", accountController.login);

// http://localhost:3000/search?title=Metro%202033 
// space = %20
router.get("/search", searchController.search);


module.exports = router;


// req values passed from authenticateJwt to accountController.viewProfile
// used as req.<variable>
router.get("/profile", authenticateJwt, accountController.viewProfile);

module.exports = router;
