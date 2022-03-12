const userTypeService = require("../services/user-type-service");
const viewUsersService = require("../services/view-users-service");
const searchUserService = require("../services/search-user-service");

const Constants = require("../constants/index");
const { controlErrorCatch } = require("../constants/error-catch");
const { formatLogMsg, fileNameFormat, controllerFnNameFormat }= require("../services/service-logger/log-format");
const serviceName = fileNameFormat( __filename, __dirname );

class AdminController {
    async userType(req, res) {

        let fnName = controllerFnNameFormat();

        // getting userTypes for use in comparisons
        const userTypes = [Constants.USER_USER, Constants.USER_ADMIN, Constants.USER_BANNED];

        // error catching

        // controlErrorCatch(res, !req.body.userId, "Target user not found.", 404);
        // controlErrorCatch(res, !req.body.password, Constants.PASSWORD_INVALID, 400);
        // controlErrorCatch(res, !req.body.type || !userTypes.some(item => req.body.type === item), "The user type is invalid. Please input 'user', 'ban', or 'admin'.", 400);

        if (!req.body.userId) {
            return res.status(404).json({ message: Constants.USER_NOTFOUND });
        }

        if (!req.body.password) {
            return res.status(400).json({ message: Constants.PASSWORD_INVALID });
        }

        if (!req.body.type || !userTypes.some(item => req.body.type === item)) {
            return res.status(400).json({ message: "The user type is invalid. Please choose 'User', 'Banned', or 'Admin'." });
        }

        const result = await userTypeService.userType(Number(req.body.userId), req.body.type, req.body.password.toString(), req.userId);
        return res.status(result.status).json({ data: result.data, message: result.message });
    }

    async viewUsers(req, res) {

        let fnName = controllerFnNameFormat();

        const result = await viewUsersService.viewUsers();
        return res.status(result.status).json({ data: result.data, message: result.message });
    }

    // unused function that may be implemented in the future
    async searchUser(req, res) {

        let fnName = controllerFnNameFormat();

        const result = await searchUserService.searchUser(req.body.username.toString());
        return res.status(result.status).json({ data: result.data, message: result.message });
    }
}

module.exports = AdminController;