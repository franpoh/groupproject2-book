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

        const users = await Users.findAll({ exclude: { password } });

        result.data = users;

        result.status = 200;
        result.message = "All users in database.";
        return result;
    }
}