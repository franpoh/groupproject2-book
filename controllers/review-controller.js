
const reviewService = require("../services/review-service");

const Constants = require("../constants/index.js");

const { formatLogMsg, fileNameFormat, controllerFnNameFormat }= require("../services/service-logger/log-format");

const serviceName = fileNameFormat( __filename, __dirname );

class reviewController {
    async addReview(req, res) {

        let fnName = controllerFnNameFormat();

        // if tokenId or body missing
        if (!req.userId || !req.body.indexId || !req.body.rev) {
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

        const loginId = req.userId; //session token
        const receivedIndexId = parseInt(req.body.indexId);
        const receivedRev = req.body.rev;
        console.log(typeof receivedIndexId, typeof receivedRev)

        if (
            typeof receivedIndexId !== "number" ||
            typeof receivedRev !== "string" ||
            !Number.isFinite(receivedIndexId)
        ) {
            res.status(400);

            let message = "Incorrect request data"; // need this for error formatLogMsg

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

        if (
            receivedRev === ''
        ) { // block if rev submitted is empty string
            res.status(400);

            let message = "Incorrect request data.."; // need this for error formatLogMsg

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

        const result = await reviewService.addReview(loginId, receivedIndexId, receivedRev);
        res.status(result.status);

        formatLogMsg({
            level: (result.status == 200 ? Constants.LEVEL_INFO : Constants.LEVEL_ERROR),
            serviceName: serviceName,
            fnName: fnName,
            text: result.message // info only
        });

        return res.json({ data: result.data, message: result.message });

        // testing
        // res.status(200);        
        // return res.json({
        //     data: {
        //         paramIndex: typeof receivedIndexId,
        //         revType: typeof receivedRev
        //     },
        //     message: 'testing the type of data received'
        // });
        // testing
    };

}
module.exports = reviewController;

