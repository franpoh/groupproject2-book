const express = require("express");
const router = express.Router();

const AccountController = require("../controllers/accountController");
const authenticateJwt = require("../authentication/authJwt");

const accountController = new AccountController();

router.post("/register", accountController.register);
router.post("/login", accountController.login);

// req values passed from authenticateJwt to accountController.viewProfile
// used as req.<variable>
router.get("/profile", authenticateJwt, accountController.viewProfile);

module.exports = router;