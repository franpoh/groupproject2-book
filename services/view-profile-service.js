const { Users, Swap, Reviews } = require("../connect.js");

const Constants = require("../constants/index");
const { errorCatch, infoLog } = require("../constants/error-catch");
const { formatLogMsg, fileNameFormat, fnNameFormat } = require("./service-logger/log-format");
const serviceName = fileNameFormat(__filename, __dirname);

module.exports = {
    viewProfile: async (userId) => {

        let fnName = fnNameFormat();

        // let result = {
        //     message: null,
        //     status: null,
        //     data: null,
        // }

        const user = await Users.findByPk(userId);

        // error catch - user is not found
        if (!user) {
            let response = errorCatch(404, Constants.USER_NOTFOUND, serviceName, fnName);
            return response;
        }

        // get user's data stored in other tables
        const reviews = await Reviews.findAll({ where: { userId: userId }, include: "Index" });
        const swap = await Swap.findAll({ where: { userId: userId }, include: "Index" });
        const purchaseHistory = await Swap.findAll({ where: { purchasedId: userId }, include: "Index" });

        // infolog
        let response = infoLog("Welcome to your profile!", serviceName, fnName);

        response.data = {
            user: user,
            reviews: reviews,
            swap: swap,
            purchaseHistory: purchaseHistory,
        }

        return response;

        // result.data = {
        //     user: user,
        //     reviews: reviews,
        //     swap: swap,
        //     purchaseHistory: purchaseHistory,
        // }

        // result.status = 200;
        // result.message = "Welcome to your profile!";

        // // winston logging
        // formatLogMsg({
        //     level: Constants.LEVEL_INFO,
        //     serviceName: serviceName,
        //     fnName: fnName,
        //     text: result.message
        // });

        // return result;
    }
}