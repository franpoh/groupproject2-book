
const reviewService = require("../services/review-service");

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
        const receivedIndexId = parseInt(req.body.indexId);
        const receivedRev = req.body.rev;
        console.log(typeof receivedIndexId, typeof receivedRev)

        if (
            typeof receivedIndexId !== "number" ||
            typeof receivedRev !== "string"
        ) {
            res.status(400);
            return res.json({ message: "Incorrect request data" });
        };

        if (
            receivedRev === ''
        ) { // block if rev submitted is empty string
            res.status(400);
            return res.json({ message: "Incorrect request data.." });
        };

        const result = await reviewService.addReview(loginId, receivedIndexId, receivedRev);
        res.status(result.status);
        return res.json({ data: result.data, message: result.message });

        // testing
        // res.status(200);        
        // return res.json({
        //     data: {
        //         paramIndex: typeof receivedIndexId,
        //         revType: typeof receivedRev
        //     },
        //     message: 'testing the type of data received'
        // });
        // testing
    };

}
module.exports = reviewController;

