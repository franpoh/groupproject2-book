const { Users } = require("../connect.js");

const Constants = require("../constants/index");
const { serviceErrorCatch } = require("../constants/error-catch");

module.exports = {
    viewUsers: async () => {
        let result = {
            message: null,
            status: null,
            data: null,
        }

        const users = await Users.findAll();

        result.data = {
            userId: users.data.userId,
            username: users.data.username,
            email: users.data.email,
            points: users.data.points,
            type: users.data.type
        }

        result.status = 200;
        result.message = "All users in database.";
        return result;
    }
}