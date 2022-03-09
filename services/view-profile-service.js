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

        const user = Users.findByPk(userId);

        serviceErrorCatch(result, !user, Constants.USER_NOTFOUND, 404);

        // if (!user) {
        //     result.message = "User not found, try logging in again.";
        //     result.status = 404;
        //     return result;
        // }

        const reviews = Reviews.findAll({ where: { userId: userId }, include: "Index" });
        const swap = Swap.findAll({ where: { userId: userId }, include: "Index" });
        const purchaseHistory = Swap.findAll({ where: { purchasedId: userId }, include: "Index" });

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