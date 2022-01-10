const swapService = require("../services/swap.service");

class SwapController {

    // G1 query: middleware verification of token here or in service?
    async swapBook(req, res) {

        // req.body.userId - for user Id buying book
        // req.body.swapId - for id of specific book in inventory

        console.log('swapBook Controller', req.body);

        if ((typeof req.body.userId !== 'number' && req.body.userId !== undefined) && (typeof req.body.swapId !== 'number' && req.body.swapId !== undefined)) {
            res.status(400);
            return res.json({
                message: 'Incorrect data types submitted..'
            });
        };

        const result = await swapService.swapBook(req.body.userId, req.body.swapId);
        res.status(result.status);        

        return res.json({
            data: result.data,
            message: result.message 
        });
    };
};

module.exports = SwapController;