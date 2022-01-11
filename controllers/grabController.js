const grabService = require("../services/grabService");

class GrabController {

    // G1 query: middleware verification of token here or in service?
    async grabBook(req, res) {

        // req.body.userId - for user Id buying book
        // req.body.swapId - for id of specific book in inventory

        console.log('swapBook Controller', req.body, !req.body.userId, !req.body.swapId  );

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

        const result = await swapService.grabBook(req.body.userId, req.body.swapId);
        res.status(result.status);        

        return res.json({
            data: result.data,
            message: result.message 
        });
    };
};

module.exports = GrabController;