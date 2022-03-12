const { Users } = require("../connect.js");

const Constants = require("../constants/index.js");

const { errorCatch, infoLog } = require("../constants/error-catch");
const { fileNameFormat, fnNameFormat } = require("../services/service-logger/log-format");
const serviceName = fileNameFormat(__filename, __dirname);

async function protectedPermission(req, res, next) {

    let fnName = fnNameFormat();

    const user = await Users.findByPk(req.userId);

    if (user.type === Constants.USER_BANNED) {
        // error catch - banned user trying to access restricted resource
        let result = errorCatch(401, "User has been banned, and therefore restricted from accessing this resource.", serviceName, fnName);
        return res.status(result.status).json({ message: result.message });
    } else {
        // infolog
        infoLog("User has permission to access this resource.", serviceName, fnName);
        next();
    }
}

async function adminPermission(req, res, next) {
    const user = await Users.findByPk(req.userId);

    if (user.type === Constants.USER_ADMIN) {
        next();
    } else {
        // error catch - user/banned user trying to access admin resource
        let result = errorCatch(401, "User does not have sufficient permissions to access this resource.", serviceName, fnName);
        return res.status(result.status).json({ message: result.message });
    }
}

module.exports = {
    protectedPermission,
    adminPermission,
}