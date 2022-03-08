const { Users } = require("../connect.js");
const Constants = require("../constants/index.js");

async function protectedPermission(req, res, next) {
    const user = await Users.findByPk(req.userId);

    if (user.type === Constants.USER_BANNED) {
        return res.send("You have been banned, and therefore restricted from accessing this resource.")
    } else {
        next();
    }
}

async function adminPermission(req, res, next) {
    const user = await Users.findByPk(req.userId);

    if (user.type === Constants.USER_ADMIN) {
        next();
    } else {
        return res.send("You do not have sufficient permissions to access this resource.")
    }
}

module.exports = {
    protectedPermission,
    adminPermission,
}