
const booksService = require("../services/booksService.js");

class booksController {
    async addReview(req, res) {

        if (typeof req.body.indexId !== "number" || typeof req.body.review !== "string" || typeof req.body.userId !== "number") {
            res.status(400);
            return res.json({ message: "Incorrect request data" });
        }

        const result = await booksService.addReview(req.body.indexId, req.body.review);
        res.status(result.status);
        return res.json({ data: result.data, message: result.message });
    };

    async search(req, res) {

        const title = req.query.title;

        if (!title) {
            res.status(400);
            return res.json({ message: "Incorrect request data" });
        }

        const result = await booksService.search(req.query.title);
        res.status(result.status);
        return res.json({ data: result.data, message: result.message });
    };


}
module.exports = booksController;

// about indexId, which will be "created by user"
// other users who did not upload this book/indexId will search for book then get this particular indexId to add personal review
// however, if another were to upload AND add review... another indexId?