const { Users, Swap, Reviews } = require("../connect.js");

const Constants = require("../constants/index");
const { serviceErrorCatch } = require("../constants/error-catch");

module.exports = {
    viewProfile: async (userId) => {
        let result = {
            message: null,
            status: null,
            data: null,
        }

        const user = await Users.findByPk(userId);

        // error catching for if user is not found
        serviceErrorCatch(result, !user, Constants.USER_NOTFOUND, 404);

        // get user's data stored in other tables
        const reviews = await Reviews.findAll({ where: { userId: userId }, include: "Index" });
        const swap = await Swap.findAll({ where: { userId: userId }, include: "Index" });
        const purchaseHistory = await Swap.findAll({ where: { purchasedId: userId }, include: "Index" });

        result.data = {
            user: user,
            reviews: reviews,
            swap: swap,
            purchaseHistory: purchaseHistory,
        }

        result.status = 200;
        result.message = "Welcome to your profile!";
        return result;
    }
}