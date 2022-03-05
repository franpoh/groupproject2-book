const wishlistService = require("../services/wishlistService");

class WishlistController {

    async addToWish(req, res) {

        // req.body.indexId - for id of specific book in index

        // if tokenId or indexId missing
        if (!req.userId || !req.body.indexId) {
            res.status(400);
            return res.json({
                message: 'Incomplete data types submitted..'
            });
        };

        const loginId = req.userId; // token's userId
        const receivedIndexId = parseInt(req.body.indexId);

        console.log('addToWish Controller', loginId, receivedIndexId);
        
        if (typeof receivedIndexId !== 'number') {
            res.status(400);
            return res.json({
                message: 'Incorrect data types submitted..'
            });
        };

        const result = await wishlistService.addToWish(loginId, receivedIndexId);
        res.status(result.status);

        return res.json({
            data: result.data,
            message: result.message 
        });

    };

    async delFrWish(req, res) {

        // req.body.indexId - for id of specific book in index

        // if tokenId or indexId missing
        if (!req.userId || !req.body.indexId) {
            res.status(400);
            return res.json({
                message: 'Incomplete data types submitted..'
            });
        };

        const loginId = req.userId; // token's userId
        const receivedIndexId = parseInt(req.body.indexId);

        console.log('addToWish Controller', loginId, receivedIndexId);

        if (typeof receivedIndexId !== 'number') {
            res.status(400);
            return res.json({
                message: 'Incorrect data types submitted..'
            });
        };

        const result = await wishlistService.delFrWish(loginId, receivedIndexId);
        res.status(result.status);

        return res.json({
            data: result.data,
            message: result.message 
        });

    };

    async checkMyWishlist(req, res) {
        
        // if tokenId missing
        if (!req.userId) {
            res.status(400);
            return res.json({
                message: 'Incomplete data types submitted..'
            });
        };

        const loginId = req.userId; // token's userId        

        const result = await wishlistService.checkMyWishlist(loginId);
        res.status(result.status);

        return res.json({
            data: result.data,
            message: result.message 
        });
    };

    // G1 testing only
    async getUsers(req, res) {

        if (!req.query.swapId) {
            req.query.swapId = 123456789
        };

        const receivedSwapId = parseInt(req.query.swapId);

        const result = await wishlistService.getUsers(receivedSwapId);
        res.status(result.status);

        return res.json({
            data: result.data,
            message: result.message 
        });
    };

};

module.exports = WishlistController;