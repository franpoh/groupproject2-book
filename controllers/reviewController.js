
const reviewService = require("../services/reviewService.js");

class reviewController {
    async addReview(req, res) {


        const loginId = req.userId; //session token 
        console.log(typeof req.params.indexId, typeof req.body.rev, typeof req.body.userId)
        if (
            typeof req.params.indexId !== "string" ||
            typeof req.body.rev !== "string" ||
            typeof req.body.userId !== "number"
        ) {
            res.status(400);
            return res.json({ message: "Incorrect request data" });
        };

        if (!req.params.indexId || !req.body.rev || !req.body.userId) {
            res.status(400);
            return res.json({ message: 'Incomplete payload entries' });
        };

        if (req.params.indexId !== res.indexId) {
            res.status(404);
            return res.json({ message: "invalid indexId" });
        }

        // check payload against token
        if (loginId !== req.body.userId) {
            res.status(400);
            return res.json({ message: 'Incorrect user ID in session submitted' });
        };

        const result = await reviewService.addReview(req.body.userId, req.params.indexId, req.body.rev);
        res.status(result.status);
        return res.json({ data: result.data, message: result.message });
    };

}
module.exports = reviewController;

