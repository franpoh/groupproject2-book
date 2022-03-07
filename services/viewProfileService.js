const { Users, Swap, Reviews } = require("../connect.js");

module.exports = {
    viewProfile: async (userId) => {
        let result = {
            message: null,
            status: null,
            data: null,
        }

        const user = await Users.findByPk(userId);

        if (!user) {
            result.message = "User not found, try logging in again.";
            result.status = 404;
            return result;
        }

        const reviews = await Reviews.findAll({ where: { userId: userId }, include: "Index" });
        const swap = await Swap.findAll({ where: [{ model: "Users", as: 'userIdTest', userId: userId }], include: "Index" });
        // const purchaseHistory = await Swap.findAll({ where: { userPurchased: userId }, include: "Index" });

        result.data = {
            user: user,
            reviews: reviews,
            swap: swap,
            // purchaseHistory: purchaseHistory,
        }

        result.status = 200;
        result.message = "Welcome to your profile!";
        return result;
    }
}