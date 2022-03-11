const { Users } = require("../connect.js");

const Constants = require("../constants/index");
const { serviceErrorCatch } = require("../constants/error-catch");

module.exports = {
    searchUser: async (username) => {
        let result = {
            message: null,
            status: null,
            data: null,
        }

        const user = await Users.findAll({
            where:
                { username: username },
            attributes: {
                exclude:
                    ['password', 'wishlist', 'imageURL', 'updatedAt']
            }
        });

        // error catching for if nothing is in found user(s) array
        if (user.length === 0) {
            result.status = 404;
            result.message = Constants.USER_NOTFOUND;
            return result;
        }

        result.data = user;
        result.status = 200;
        result.message = "User found.";
        return result;
    }
}