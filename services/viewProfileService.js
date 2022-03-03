const { Users, Swap, Reviews } = require("../connect.js");

module.exports = {
    viewProfile: async (userId) => {
        let result = {
            message: null,
            status: null,
            data: null,
        }

        const user = await Users.findByPk(userId, { include: [Swap, Reviews] });

        if (!user) {
            result.message = "User not found. Please try logging in again.";
            result.status = 404;
            return result;
        }

        result.status = 200;
        result.data = user;
        result.message = "Welcome to your profile!";
        return result;
    }
}