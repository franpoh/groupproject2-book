
const reviewService = require("../services/reviewService.js");

class reviewController {
    async addReview(req, res) {

        console.log(typeof req.body.indexId, typeof req.body.rev, typeof req.body.userId)
        if (typeof req.body.indexId !== "number" || typeof req.body.rev !== "string" || typeof req.body.userId !== "number") {
            res.status(400);
            return res.json({ message: "Incorrect request data" });
        }


        // if (req.body.rev === res.body.rev) {
        //     res.status(400);
        //     return res.json({ message: "entry invalid: duplicate" });
        // }


        const result = await reviewService.addReview(req.body.userId, req.body.indexId, req.body.rev);
        res.status(result.status);
        return res.json({ data: result.data, message: result.message });
    };

}
module.exports = reviewController;

