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

        const user = await Users.findAll({ where: 
            { username: username },
            attributes: { exclude: 
                ['password', 'wishlist', 'imageURL', 'updatedAt'] 
            } 
        });

        serviceErrorCatch(result, !user, Constants.USER_NOTFOUND, 404);

        result.data = user;
        result.status = 200;
        result.message = "User found.";
        return result;
    }
}