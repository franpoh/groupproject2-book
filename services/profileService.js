const { Users } = require("../connect.js");

module.exports = {
    viewProfile: async (username) => {
        let result = {
            message: null,
            status: null,
            data: null,
        }

        const user = await Users.findOne({ where: { username: username } });

        result.status = 200;
        result.data = JSON.stringify(user);
        result.message = "Welcome to your profile!";
        return result;
    }
}