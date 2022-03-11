const viewProfileService = require("../services/view-profile-service");
const editProfileService = require("../services/edit-profile-service")
const Constants = require("../constants/index");
const { controlErrorCatch, validEmail, pwdByteLen } = require("../constants/error-catch");

class accountController {
    async viewProfile(req, res) {

        const result = await viewProfileService.viewProfile(req.userId); // using values passed from jwt authentication middleware
        return res.status(result.status).json({ data: result.data, message: result.message });
    }

    async editProfile(req, res) {

        // Checking byte length of password
        let checkLength = pwdByteLen(req.body.newPassword);

        // check if email meets all email formatting requirements
        let vEmail = validEmail(req.body.email);

        // error catching
        controlErrorCatch(res, !vEmail, Constants.EMAIL_INVALID, 400);
        controlErrorCatch(res, !req.body.oldPassword, Constants.PASSWORD_INVALID, 400);

        // checking if there is a new password
        // and if there is, if it meets minimum length
        if (!req.body.newPassword) {
            console.log("There is no new password.")
        } else if (checkLength > 72 || req.body.newPassword.length < 5) {
            return res.status(400).json({ message: Constants.PASSWORD_CHARS });
        }

        const result = await editProfileService.editProfile(req.userId, req.body.email.toString(), req.body.oldPassword.toString(), req.body.newPassword.toString());
       
        return res.status(result.status).json({ data: result.data, message: result.message });
    }
}

module.exports = accountController;