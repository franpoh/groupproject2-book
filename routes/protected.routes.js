const express = require("express");
const router = express.Router();

const SwapController = require("../controllers/swap.controller");

const swapController = new SwapController();

// G1 100122: for testing only. Also query some real life examples use session unique URIs, is it due prevent bookmark/copied URL + cached data + long expiry? eg . /e6xxh61s/swap
router.get('/protected', (req, res) => {    
    return res.send('Calling on protected route..');
});


router.post('/protected/swap', swapController.swapBook);


module.exports = router;