const userTypeService = require("../services/user-type-service");
const viewUsersService = require("../services/view-users-service");
const searchUserService = require("../services/search-user-service");

const Constants = require("../constants/index");

const { errorCatch } = require("../constants/error-catch");
const { fileNameFormat, controllerFnNameFormat } = require("../services/service-logger/log-format");
const serviceName = fileNameFormat( __filename, __dirname );



// ----------------------------------------- PASSED TO PROTECTED ROUTES
class AdminController {

    // ----------------------------------------- EDIT USER TYPE
    async userType(req, res) {

        let fnName = controllerFnNameFormat();

        // getting userTypes for use in comparisons
        const userTypes = [Constants.USER_USER, Constants.USER_ADMIN, Constants.USER_BANNED];

        // error catch - user not found
        if (!req.body.userId) {
            let result = errorCatch(404, Constants.USER_NOTFOUND, serviceName, fnName);
            return res.status(result.status).json({ message: result.message });
        }

        // error catch - password invalid
        if (!req.body.password) {
            let result = errorCatch(400, Constants.PASSWORD_INVALID, serviceName, fnName);
            return res.status(result.status).json({ message: result.message });
        }

        // error catch - user type chosen is invalid (did not select from dropdown menu)
        if (!req.body.type || !userTypes.some(item => req.body.type === item)) {
            let result = errorCatch(400, "User type is invalid. Choose 'User', 'Banned', or 'Admin'.", serviceName, fnName);
            return res.status(result.status).json({ message: result.message });
        }

        const result = await userTypeService.userType(Number(req.body.userId), req.body.type, req.body.password.toString(), req.userId);
        return res.status(result.status).json({ data: result.data, message: result.message });
    }

    // ----------------------------------------- VIEW ALL USERS
    async viewUsers(req, res) {

        const result = await viewUsersService.viewUsers();
        return res.status(result.status).json({ data: result.data, message: result.message });
    }

    // ----------------------------------------- SEARCH FOR A USER
    // unused function that may be implemented in the future
    async searchUser(req, res) {

        const result = await searchUserService.searchUser(req.body.username.toString());
        return res.status(result.status).json({ data: result.data, message: result.message });
    }
}

module.exports = AdminController;