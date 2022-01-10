const express = require("express");
const router = express.Router();

const AccountController = require("../controllers/accountController");

const accountController = new AccountController();

router.post("/register", accountController.register);
router.post("/login", accountController.login);

module.exports = router;