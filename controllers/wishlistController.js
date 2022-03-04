const wishlistSerivce = require("../services/wishlistService");

class WishlistController {

    async addToWish(req, res) {

        const loginId = req.userId; // token's userId
        const receivedIndexId = parseInt(req.body.indexId);

        console.log('addToWish Controller', loginId, receivedIndexId);

        // if userId or indexId missing
        if (!receivedIndexId) {
            res.status(400);
            return res.json({
                message: 'Incomplete data types submitted..'
            });
        };

        if (typeof receivedIndexId !== 'number') {
            res.status(400);
            return res.json({
                message: 'Incorrect data types submitted..'
            });
        };

        const result = await wishlistSerivce.addToWish(loginId, receivedIndexId);
        res.status(result.status);

        return res.json({
            data: result.data,
            message: result.message 
        });

    };

    async delFrWish(req, res) {

        const loginId = req.userId; // token's userId
        const receivedIndexId = parseInt(req.body.indexId);

        console.log('addToWish Controller', loginId, receivedIndexId);

        // if userId or indexId missing
        if (!receivedIndexId) {
            res.status(400);
            return res.json({
                message: 'Incomplete data types submitted..'
            });
        };

        if (typeof receivedIndexId !== 'number') {
            res.status(400);
            return res.json({
                message: 'Incorrect data types submitted..'
            });
        };

        const result = await wishlistSerivce.delFrWish(loginId, receivedIndexId);
        res.status(result.status);

        return res.json({
            data: result.data,
            message: result.message 
        });

    };

    async checkMyWishlist(req, res) {       

        const loginId = req.userId; // token's userId        

        const result = await wishlistSerivce.checkMyWishlist(loginId);
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