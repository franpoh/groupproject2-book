const viewProfileService = require("../services/view-profile-service");
const editProfileService = require("../services/edit-profile-service")

const Constants = require("../constants/index");

const { errorCatch, validEmail, pwdByteLen, infoLog } = require("../constants/error-catch");
const { fileNameFormat, controllerFnNameFormat } = require("../services/service-logger/log-format");
const serviceName = fileNameFormat( __filename, __dirname );



// ----------------------------------------- PASSED TO PROTECTED ROUTES
class accountController {

    // ----------------------------------------- VIEW PROFILE
    async viewProfile(req, res) {

        const result = await viewProfileService.viewProfile(req.userId); // using values passed from jwt authentication middleware
        return res.status(result.status).json({ data: result.data, message: result.message });
    }

    // ----------------------------------------- EDIT PROFILE
    async editProfile(req, res) {

        let fnName = controllerFnNameFormat();

        // Checking byte length of password
        let checkLength = pwdByteLen(req.body.newPassword);

        // check if email meets all email formatting requirements
        let vEmail = validEmail(req.body.email);

        // error catch - if email invalid
        if (!vEmail) {
            let result = errorCatch(400, Constants.EMAIL_INVALID, serviceName, fnName);
            return res.status(result.status).json({ message: result.message });
        }

        // error catch - if password invalid (not filled in)
        if (!req.body.oldPassword) {
            let result = errorCatch(400, Constants.PASSWORD_INVALID, serviceName, fnName);
            return res.status(result.status).json({ message: result.message });
        }

        // checking if there is a new password
        // and if there is, if it meets minimum length
        if (!req.body.newPassword) {
            infoLog("There is no new password.", serviceName, fnName);
            
        } else if (checkLength > 72 || req.body.newPassword.length < 5) {
            let result = errorCatch(400, Constants.PASSWORD_CHARS, serviceName, fnName);
            return res.status(result.status).json({ message: result.message });
        }

        const result = await editProfileService.editProfile(req.userId, req.body.email.toString(), req.body.oldPassword.toString(), req.body.newPassword.toString());
       
        return res.status(result.status).json({ data: result.data, message: result.message });
    }
}

module.exports = accountController;