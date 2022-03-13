const searchService = require("../services/search-service");

const Constants = require("../constants/index.js");

const { formatLogMsg, fileNameFormat, controllerFnNameFormat }= require("../services/service-logger/log-format");

const serviceName = fileNameFormat( __filename, __dirname );

class searchController {

    async search(req, res) {

        let fnName = controllerFnNameFormat();

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

        let fnName = controllerFnNameFormat();

        if (!req.query.bookID) {
            res.status(400);
            return res.json({
                message: 'Incorrect data types submitted...'
            });
        };

        const indexId = parseInt(req.query.bookID);

        if (typeof indexId != 'number' || !Number.isFinite(indexId)) {
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

    async searchIndexByParams(req, res) {

        let fnName = controllerFnNameFormat();

        const bookAuthor = req.body.bookAuthor;
        const bookTitle = req.body.bookTitle;

        const result = await searchService.searchIndexByParams(bookTitle, bookAuthor)
        res.status(result.status);
        return res.json ({
            data: result.data,
            message: result.message
        });
    };

    async searchIndex(req, res) {

        let fnName = controllerFnNameFormat();

        const result = await searchService.searchIndex();
        res.status(result.status);
        return res.json({ data: result.data, message: result.message });
    };

    async searchSwapByIndex(req, res) {

        let fnName = controllerFnNameFormat();

        const receivedIndexId = parseInt(req.query.indexId);

        // if indexId missing
        if (!receivedIndexId) {
            res.status(400);
            return res.json({
                message: 'Incomplete data types submitted..'
            });
        };

        if (typeof receivedIndexId !== 'number') {
            res.status(400);
            return res.json({
                message: 'Incorrect data types submitted..'
            });
        };

        const result = await searchService.searchSwapByIndex(receivedIndexId);
        res.status(result.status);
        return res.json({
            data: result.data,
            message: result.message
        });
    };

    async allReviews(req, res) {

        let fnName = controllerFnNameFormat();

        const indexId = parseInt(req.query.indexId);

        if (typeof parseInt(indexId) != 'number') {
            res.status(400);
            return res.json({
                message: 'Incorrect data types submitted...'
            });
        };

        const result = await searchService.allReviews(indexId);
        res.status(result.status);
        return res.json({ data: result.data, message: result.message });
    };

    async searchGenres(req, res) {

        let fnName = controllerFnNameFormat();

        const result = await searchService.allGenres()
        res.status(result.status);
        return res.json({ data: result.data, message: result.message });
    };

}
module.exports = searchController;