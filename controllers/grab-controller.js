const grabService = require("../services/grab-service");

const Constants = require("../constants/index.js");

const { formatLogMsg, fileNameFormat, controllerFnNameFormat }= require("../services/service-logger/log-format");

const serviceName = fileNameFormat( __filename, __dirname );

class GrabController {

    async grabBook(req, res) {

        let fnName = controllerFnNameFormat(new Error());
        // let fnName = new Error().stack;

        // req.body.swapId - for id of specific book in inventory

        // if tokenId or swapId missing
        if (!req.userId || !req.body.swapId) {
            res.status(400);
            res.json({
                message: 'Incomplete data types submitted..'
            });

            formatLogMsg({
                level: Constants.LEVEL_ERROR,
                serviceName: serviceName,
                fnName: fnName,
                text: res.message
            });

            return res;
        };

        const loginId = req.userId; // token's userId
        const receivedSwapId = parseInt(req.body.swapId);

        console.log('grabBook Controller', loginId, receivedSwapId);

        if (typeof receivedSwapId !== 'number') {
            res.status(400);
            return res.json({
                message: 'Incorrect data types submitted..'
            });
        };

        const result = await grabService.grabBook(loginId, receivedSwapId);
        res.status(result.status);

        return res.json({
            data: result.data,
            message: result.message
        });
    };
};

module.exports = GrabController;