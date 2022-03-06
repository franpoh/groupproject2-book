
const reviewService = require("../services/reviewService.js");

class reviewController {
    async addReview(req, res) {

        // if tokenId or body missing
        if (!req.userId || !req.body.indexId || !req.body.rev) {
            res.status(400);
            return res.json({
                message: 'Incomplete data types submitted..'
            });
        };

        const loginId = req.userId; //session token
        const receivedIndexId = req.body.indexId;
        const receivedRev = req.body.rev;
        console.log(typeof receivedIndexId, typeof receivedRev)

        // if (
        //     typeof req.params.indexId !== "string" ||
        //     typeof req.body.rev !== "string" ||
        //     typeof req.body.userId !== "number"
        // ) {
        //     res.status(400);
        //     return res.json({ message: "Incorrect request data" });
        // };      

        // const result = await reviewService.addReview(req.body.userId, req.params.indexId, req.body.rev);
        // res.status(result.status);
        // return res.json({ data: result.data, message: result.message });

        // testing
        res.status(200);        
        // const result = await reviewService.addReview(req.body.userId, req.params.indexId, req.body.rev);
        
        return res.json({
            data: {
                paramIndex: typeof receivedIndexId,
                revType: typeof receivedRev
            },
            message: 'testing the type of data received'
        });
        // testing
    };

}
module.exports = reviewController;

