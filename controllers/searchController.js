
const searchService = require("../services/searchService.js");

class searchController {

    async search(req, res) {

        const title = req.query.title;

        if (!title) {
            res.status(400);
            return res.json({ message: "invalid URL" });
        }

        const result = await searchService.search(req.query.title);
        res.status(result.status);
        return res.json({ data: result.data, message: result.message });
    };

    async detail(req, res) {

        const indexId = req.query.bookID;

        if (!indexId || typeof parseInt(indexId) != 'number') {
            res.status(400);
            return res.json({
                message: 'Incorrect data types submitted...'
            });
        };

        const result = await searchService.detail(indexId);
        res.status(result.status);

        return res.json({
            data: result.data,
            message: result.message
        });

    };

    async searchIndex(req, res) {

        // const title = req.query.title;

        // if (!title) {
        //     res.status(400);
        //     return res.json({ message: "invalid URL" });
        // }

        const result = await searchService.searchIndex();
        res.status(result.status);
        return res.json({ data: result.data, message: result.message });
    };

}
module.exports = searchController;