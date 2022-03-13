const express = require("express");
const router = express.Router();

const ReviewController = require("../controllers/review-controller");
const GrabController = require("../controllers/grab-controller");
const WishlistController = require("../controllers/wishlist-controller");
const AccountController = require("../controllers/account-controller");
const AdminController = require("../controllers/admin-controller");
const UploadController = require("../controllers/upload-controller");


const reviewController = new ReviewController();
const grabController = new GrabController();
const wishlistController = new WishlistController();
const accountController = new AccountController();
const adminController = new AdminController();
const uploadController = new UploadController();


router.post("/protected/addReview", reviewController.addReview);

// for grabbing book with credit
router.post('/protected/grab', grabController.grabBook);

// for adding book to user's wishlist
router.post('/protected/addwish', wishlistController.addToWish);
// for removing book from user's wishlist
router.post('/protected/delwish', wishlistController.delFrWish);
// for check user's wishlist
router.get('/protected/wishlist', wishlistController.checkMyWishlist);


// G1 100122: for testing only. Also query some real life examples use session unique URIs, is it due prevent bookmark/copied URL + cached data + long expiry? eg . /e6xxh61s/swap
router.get('/protected', (req, res) => {
    return res.send('Calling on protected route..');
});

router.post("/protected/uploadbook", uploadController.uploadbook);

// user account actions
// view profile
router.get("/protected/viewprofile", accountController.viewProfile);

// edit email and/or password
router.put("/protected/editprofile", accountController.editProfile);

// actions that need admin permissions

// edit user type to USER, ADMIN or BANNED
router.put("/protected/admin/usertype", adminController.userType);

// view all users, returning only safe data
router.get("/protected/admin/viewusers", adminController.viewUsers);

// search for user
router.get("/protected/admin/searchuser", adminController.searchUser);

module.exports = router;