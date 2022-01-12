const grabService = require("../services/grabService");

class GrabController {

    async grabBook(req, res) {

        // req.body.userId - for user Id buying book
        // req.body.swapId - for id of specific book in inventory

        const loginId = req.userId; // token's userId

        console.log('swapBook Controller', loginId, req.body, !req.body.userId, !req.body.swapId  );

        // if userId or swapId missing
        if (!req.body.userId || !req.body.swapId) {
            res.status(400);
            return res.json({
                message: 'Incomplete data types submitted..'
            });
        };

        if (typeof req.body.userId !== 'number' || typeof req.body.swapId !== 'number') {
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


        const result = await grabService.grabBook(req.body.userId, req.body.swapId);
        res.status(result.status);        

        return res.json({
            data: result.data,
            message: result.message 
        });
    };
};

module.exports = GrabController;