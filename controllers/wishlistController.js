const wishlistSerivce = require("../services/wishlistService");

class WishlistController {

    async addToWish(req, res) {

        // req.body.userId - for user Id adding book to wishlist
        // req.body.indexId - for id of specific book in index

        const loginId = req.userId; // token's userId

        console.log('addToWish Controller', loginId, req.body, !req.body.userId, !req.body.indexId);

        // if userId or indexId missing
        if (!req.body.userId || !req.body.indexId) {
            res.status(400);
            return res.json({
                message: 'Incomplete data types submitted..'
            });
        };

        if (typeof req.body.userId !== 'number' || typeof req.body.indexId !== 'number') {
            res.status(400);
            return res.json({
                message: 'Incorrect data types submitted..'
            });
        };

        // in case submitted body userId do not match token userId
        if (loginId !== req.body.userId) {
            res.status(400);
            return res.json({
                message: 'Incorrect user ID submitted..'
            });
        };

        const result = await wishlistSerivce.addToWish(req.body.userId, req.body.indexId);
        res.status(result.status);

        return res.json({
            data: result.data,
            message: result.message 
        });

    };

    async delFrWish(req, res) {

        const loginId = req.userId; // token's userId

        console.log('addToWish Controller', loginId, req.body, !req.body.userId, !req.body.indexId);

        // if userId or indexId missing
        if (!req.body.userId || !req.body.indexId) {
            res.status(400);
            return res.json({
                message: 'Incomplete data types submitted..'
            });
        };

        if (typeof req.body.userId !== 'number' || typeof req.body.indexId !== 'number') {
            res.status(400);
            return res.json({
                message: 'Incorrect data types submitted..'
            });
        };

        // in case submitted body userId do not match token userId
        if (loginId !== req.body.userId) {
            res.status(400);
            return res.json({
                message: 'Incorrect user ID submitted..'
            });
        };

        const result = await wishlistSerivce.delFrWish(req.body.userId, req.body.indexId);
        res.status(result.status);

        return res.json({
            data: result.data,
            message: result.message 
        });

    };

    async checkMyWishlist(req, res) {       

        const loginId = req.userId; // token's userId
        

        if (typeof req.body.indexId !== 'number') {
            res.status(411);
            return res.json({
                message: `Incorrect data types submitted..${req.body.indexId}...${typeof req.body.indexId !== 'number'}`
            });
        };

        // console.log('checkMyWishlist Controller', loginId, req.body.userId); // body should be empty for checkMyWishlist but amended to use body.userId due webapp etc etc

        // const result = await wishlistSerivce.checkMyWishlist(parseInt(req.body.userId));
        const result = await wishlistSerivce.checkMyWishlist(loginId, parseInt(req.body.indexId));
        res.status(result.status);

        return res.json({
            data: result.data,
            message: result.message 
        });
    };

    // G1 testing only
    async getUsers(req, res) {
        const result = await wishlistSerivce.getUsers();
        res.status(result.status);

        return res.json({
            data: result.data,
            message: result.message 
        });
    };

};

module.exports = WishlistController;