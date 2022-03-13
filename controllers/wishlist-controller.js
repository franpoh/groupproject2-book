const wishlistService = require("../services/wishlist-service");

const Constants = require("../constants/index.js");

const { formatLogMsg, fileNameFormat, controllerFnNameFormat }= require("../services/service-logger/log-format");

const serviceName = fileNameFormat( __filename, __dirname );

class WishlistController {

    async addToWish(req, res) {

        let fnName = controllerFnNameFormat();

        // req.body.indexId - for id of specific book in index

        // if tokenId or indexId missing
        if (!req.userId || !req.body.indexId) {
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

        const loginId = req.userId; // token's userId
        const receivedIndexId = parseInt(req.body.indexId);

        // console.log('addToWish Controller', loginId, receivedIndexId);

        if (typeof receivedIndexId !== 'number' ||  !Number.isFinite(receivedIndexId)) {
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

        const result = await wishlistService.addToWish(loginId, receivedIndexId);
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

    async delFrWish(req, res) {

        let fnName = controllerFnNameFormat();

        // req.body.indexId - for id of specific book in index

        // if tokenId or indexId missing
        if (!req.userId || !req.body.indexId) {
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

        const loginId = req.userId; // token's userId
        const receivedIndexId = parseInt(req.body.indexId);

        // console.log('addToWish Controller', loginId, receivedIndexId);

        if (typeof receivedIndexId !== 'number' || !Number.isFinite(receivedIndexId)) {
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

        const result = await wishlistService.delFrWish(loginId, receivedIndexId);
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

    async checkMyWishlist(req, res) {

        let fnName = controllerFnNameFormat();

        // if tokenId missing
        if (!req.userId) {
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

        const loginId = req.userId; // token's userId        

        const result = await wishlistService.checkMyWishlist(loginId);
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
};

module.exports = WishlistController;