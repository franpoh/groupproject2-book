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

        let p = new Promise(async (resolve, reject) => {
            const user = await Users.findAll({
                where:
                    { username: username },
                attributes: {
                    exclude:
                        ['password', 'wishlist', 'imageURL', 'updatedAt']
                }
            });

            if (user.length === 0) {
                reject();
            } else {
                resolve(user);
            }
        })

        p.then((user) => {
            result.data = user;
            result.status = 200;
            result.message = "User found.";
            return result;
        }).catch(() => {
            result.status = 404;
            result.message = Constants.USER_NOTFOUND;
            return result;
        })

        // const user = await Users.findAll({
        //     where:
        //         { username: username },
        //     attributes: {
        //         exclude:
        //             ['password', 'wishlist', 'imageURL', 'updatedAt']
        //     }
        // });

        // serviceErrorCatch(result, user.length === 0, Constants.USER_NOTFOUND, 404);

        // if (user.length === 0) {
        //     result.status = 404;
        //     result.message = Constants.USER_NOTFOUND;
        //     return result;
        // }

        // result.data = user;
        // result.status = 200;
        // result.message = "User found.";
        // return result;
    }
}