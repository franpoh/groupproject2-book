const grabService = require("../services/grab-service");

const Constants = require("../constants/index.js");

const { formatLogMsg, fileNameFormat, controllerFnNameFormat }= require("../services/service-logger/log-format");

const serviceName = fileNameFormat( __filename, __dirname );

class GrabController {

    async grabBook(req, res) {

        let fnName = controllerFnNameFormat();

        // req.body.swapId - for id of specific book in inventory

        // if tokenId or swapId missing
        if (!req.userId || !req.body.swapId) {
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
        const receivedSwapId = parseInt(req.body.swapId);

        // console.log('grabBook Controller', loginId, receivedSwapId);

        if (typeof receivedSwapId !== 'number' || !Number.isFinite(receivedSwapId)) {
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

        const result = await grabService.grabBook(loginId, receivedSwapId);
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

module.exports = GrabController;