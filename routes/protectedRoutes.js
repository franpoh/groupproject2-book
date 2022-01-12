const express = require("express");
const router = express.Router();

const authenticateJwt = require("../authentication/authJwt");

const ReviewController = require("../controllers/reviewController");
const GrabController = require("../controllers/grabController");


const reviewController = new ReviewController();
const grabController = new GrabController();


router.post("/protected/addReview", reviewController.addReview);

// for grabbing book with credit
router.post('/protected/swap', authenticateJwt, grabController.grabBook);


// G1 100122: for testing only. Also query some real life examples use session unique URIs, is it due prevent bookmark/copied URL + cached data + long expiry? eg . /e6xxh61s/swap
router.get('/protected', (req, res) => {
    return res.send('Calling on protected route..');
});

router.post('/protected/swap', grabController.grabBook);

// Aaron - Upload Controller
const UploadController = require ("../controllers/uploadController");

const uploadController = new UploadController();

router.post("/protected/uploadbook", uploadController.uploadbook);

// req values passed from authenticateJwt to accountController.viewProfile
// used as req.<variable>
const AccountController = require("../controllers/accountController");
const accountController = new AccountController();

router.get("/protected/profile", accountController.viewProfile);
router.put("/protected/editprofile", accountController.editProfile);

module.exports = router;