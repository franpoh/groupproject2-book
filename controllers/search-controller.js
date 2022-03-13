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

            let message = 'invalid URL'; // need this for error formatLogMsg

            formatLogMsg({
                level: Constants.LEVEL_ERROR,
                serviceName: serviceName,
                fnName: fnName,
                text: message
            });

            return res.json({
                message: message
            });            
        }

        const result = await searchService.search(req.query.title);
        res.status(result.status);

        formatLogMsg({
            level: (result.status == 200 ? Constants.LEVEL_INFO : Constants.LEVEL_ERROR),
            serviceName: serviceName,
            fnName: fnName,
            text: result.message // info only
        });

        return res.json({ data: result.data, message: result.message });
    };

    async detail(req, res) {

        let fnName = controllerFnNameFormat();

        if (!req.query.bookID) {
            res.status(400);

            let message = 'Incomplete data types submitted..'; // need this for error formatLogMsg

            formatLogMsg({
                level: Constants.LEVEL_ERROR,
                serviceName: serviceName,
                fnName: fnName,
                text: message
            });

            return res.json({
                message: message
            });
        };

        const indexId = parseInt(req.query.bookID);

        if (typeof indexId != 'number' || !Number.isFinite(indexId)) {
            res.status(400);

            let message = 'Incorrect data types submitted...'; // need this for error formatLogMsg

            formatLogMsg({
                level: Constants.LEVEL_ERROR,
                serviceName: serviceName,
                fnName: fnName,
                text: message
            });

            return res.json({
                message: message
            });
        };

        const result = await searchService.detail(indexId);
        res.status(result.status);

        formatLogMsg({
            level: (result.status == 200 ? Constants.LEVEL_INFO : Constants.LEVEL_ERROR),
            serviceName: serviceName,
            fnName: fnName,
            text: result.message // info only
        });

        return res.json({
            data: result.data,
            message: result.message
        });

    };

    async searchIndexByParams(req, res) {

        let fnName = controllerFnNameFormat();

        if (!req.body.bookAuthor || !req.body.bookTitle) {
            res.status(400);

            let message = 'Incomplete data types submitted..'; // need this for error formatLogMsg

            formatLogMsg({
                level: Constants.LEVEL_ERROR,
                serviceName: serviceName,
                fnName: fnName,
                text: message
            });

            return res.json({
                message: message
            });
        };

        const bookAuthor = req.body.bookAuthor;
        const bookTitle = req.body.bookTitle;

        // need string check/cleaning here?

        const result = await searchService.searchIndexByParams(bookTitle, bookAuthor)
        res.status(result.status);

        formatLogMsg({
            level: (result.status == 200 ? Constants.LEVEL_INFO : Constants.LEVEL_ERROR),
            serviceName: serviceName,
            fnName: fnName,
            text: result.message // info only
        });

        return res.json ({
            data: result.data,
            message: result.message
        });
    };

    async searchIndex(req, res) {

        let fnName = controllerFnNameFormat();

        const result = await searchService.searchIndex();
        res.status(result.status);

        formatLogMsg({
            level: (result.status == 200 ? Constants.LEVEL_INFO : Constants.LEVEL_ERROR),
            serviceName: serviceName,
            fnName: fnName,
            text: result.message // info only
        });

        return res.json({ data: result.data, message: result.message });
    };

    async searchSwapByIndex(req, res) {

        let fnName = controllerFnNameFormat();

        if (!req.query.indexId) {
            res.status(400);

            let message = 'Incomplete data types submitted..'; // need this for error formatLogMsg

            formatLogMsg({
                level: Constants.LEVEL_ERROR,
                serviceName: serviceName,
                fnName: fnName,
                text: message
            });

            return res.json({
                message: message
            });
        };

        const receivedIndexId = parseInt(req.query.indexId);

        if (typeof receivedIndexId !== 'number' || !Number.isFinite(receivedIndexId)) {
            res.status(400);

            let message = 'Incomplete data types submitted..'; // need this for error formatLogMsg

            formatLogMsg({
                level: Constants.LEVEL_ERROR,
                serviceName: serviceName,
                fnName: fnName,
                text: message
            });

            return res.json({
                message: message
            });
        };

        const result = await searchService.searchSwapByIndex(receivedIndexId);
        res.status(result.status);

        formatLogMsg({
            level: (result.status == 200 ? Constants.LEVEL_INFO : Constants.LEVEL_ERROR),
            serviceName: serviceName,
            fnName: fnName,
            text: result.message // info only
        });

        return res.json({
            data: result.data,
            message: result.message
        });
    };

    async allReviews(req, res) {

        let fnName = controllerFnNameFormat();

        if (!req.query.indexId) {
            res.status(400);

            let message = 'Incomplete data types submitted..'; // need this for error formatLogMsg

            formatLogMsg({
                level: Constants.LEVEL_ERROR,
                serviceName: serviceName,
                fnName: fnName,
                text: message
            });

            return res.json({
                message: message
            });
        };

        const indexId = parseInt(req.query.indexId);

        if (typeof parseInt(indexId) != 'number' || !Number.isFinite(indexId)) {
            res.status(400);

            let message = 'Incorrect data types submitted..'; // need this for error formatLogMsg

            formatLogMsg({
                level: Constants.LEVEL_ERROR,
                serviceName: serviceName,
                fnName: fnName,
                text: message
            });

            return res.json({
                message: message
            });
        };

        const result = await searchService.allReviews(indexId);
        res.status(result.status);

        formatLogMsg({
            level: (result.status == 200 ? Constants.LEVEL_INFO : Constants.LEVEL_ERROR),
            serviceName: serviceName,
            fnName: fnName,
            text: result.message // info only
        });

        return res.json({ data: result.data, message: result.message });
    };

    async searchGenres(req, res) {

        let fnName = controllerFnNameFormat();

        const result = await searchService.allGenres()
        res.status(result.status);

        formatLogMsg({
            level: (result.status == 200 ? Constants.LEVEL_INFO : Constants.LEVEL_ERROR),
            serviceName: serviceName,
            fnName: fnName,
            text: result.message // info only
        });
        
        return res.json({ data: result.data, message: result.message });
    };

}
module.exports = searchController;