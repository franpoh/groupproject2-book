const viewProfileService = require("../services/view-profile-service");
const editProfileService = require("../services/edit-profile-service")
const Constants = require("../constants/index");
const { errorCatch, validEmail, pwdByteLen } = require("../constants/error-catch"),

class accountController {
    async viewProfile(req, res) {

        const result = await viewProfileService.viewProfile(req.userId); // using values passed from authenticateJwt
       
        return res.status(result.status).json({ message: result.message });
    }

    async editProfile(req, res) {

        // Checking byte length of password
        let checkLength = pwdByteLen(req.body.newPassword);

        // check if email meets all email formatting requirements
        let vEmail = validEmail(req.body.email);

        // error catching
        errorCatch(!vEmail, Constants.EMAIL_INVALID);
        errorCatch(checkLength > 72 || req.body.newPassword.length < 5, Constants.PASSWORD_CHARS);
        errorCatch(!req.body.oldPassword, Constants.PASSWORD_INVALID);
        errorCatch(req.body.username.length < 3 || req.body.username.length > 10, Constants.USER_CHARS);

        // if (!req.body.newPassword) {
        //     console.log("There is no new password.")
        // } else if (checkLength > 72 || req.body.newPassword.length < 5) {
        //     return res.status(400).json({ message: Constants.PASSWORD_CHARS });
        // }

        // if (!req.body.oldPassword) {
        //     return res.status(400).json({ message: Constants.PASSWORD_INVALID });
        // }

        // if (req.body.username.length < 3 || req.body.username.length > 10) {
        //     return res.status(400).json({ message: Constants.USER_CHARS });
        // }

        const result = await editProfileService.editProfile(req.userId, req.body.email.toString(), req.body.oldPassword.toString(), req.body.newPassword.toString());
       
        return res.status(result.status).json({ message: result.message });
    }
}

module.exports = accountController;