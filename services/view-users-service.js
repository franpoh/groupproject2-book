const { Users } = require("../connect.js");

const { serviceErrorCatch } = require("../constants/error-catch");

module.exports = {
    viewUsers: async () => {
        let result = {
            message: null,
            status: null,
            data: null,
        }

        const users = await Users.findAll({ 
            attributes: { exclude: 
                ['password', 'wishlist', 'imageURL', 'updatedAt'] 
            } 
        });

        serviceErrorCatch(result, !users, "Users not found", 404);

        result.data = users;
        result.status = 200;
        result.message = "All users in database.";
        return result;
    }
}