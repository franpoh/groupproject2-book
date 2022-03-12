const { Users, Swap, Reviews } = require("../connect.js");

const Constants = require("../constants/index");
const { errorCatch, infoLog } = require("../constants/error-catch");
const { fileNameFormat, fnNameFormat } = require("./service-logger/log-format");
const serviceName = fileNameFormat(__filename, __dirname);

module.exports = {
    viewProfile: async (userId) => {

        let fnName = fnNameFormat();

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
    }
}