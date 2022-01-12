
const reviewService = require("../services/reviewService.js");

class reviewController {
    async addReview(req, res) {


        const loginId = req.userId;
        console.log(typeof req.params.indexId, typeof req.body.rev, typeof req.body.userId)
        if (
            typeof req.params.indexId !== "string" ||
            typeof req.body.rev !== "string" ||
            typeof req.body.userId !== "number"
        ) {

            res.status(400);
            return res.json({ message: "Incorrect request data" });
        }

        // add in check for jwt
        if (loginId !== req.body.userId) {
            res.status(400);
            return res.json({
                message: 'Incorrect user ID submitted..'
            });
        };


        const result = await reviewService.addReview(req.body.userId, req.params.indexId, req.body.rev);
        res.status(result.status);
        return res.json({ data: result.data, message: result.message });
    };

}
module.exports = reviewController;

