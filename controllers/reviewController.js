
const reviewService = require("../services/reviewService.js");

class reviewController {
    async addReview(req, res) {

        if (typeof req.body.indexId !== "number" || typeof req.body.review !== "string" || typeof req.body.userId !== "number") {
            res.status(400);
            return res.json({ message: "Incorrect request data" });
        }

        const result = await reviewService.addReview(req.body.indexId, req.body.review);
        res.status(result.status);
        return res.json({ data: result.data, message: result.message });
    };

}
module.exports = reviewController;

