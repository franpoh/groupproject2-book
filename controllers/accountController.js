const viewProfileService = require("../services/viewProfileService");
const editProfileService = require("../services/editProfileService")

class accountController {
    async viewProfile(req, res) {
        const result = await viewProfileService.viewProfile(req.userId); // using values passed from authenticateJwt
        res.status(result.status);
        return res.json({ data: result.data, message: result.message });
    }

    async editProfile(req, res) {
        let checkLength = new TextEncoder().encode(req.body.newPassword).length;
        console.log("Checking byte length: ", checkLength);

        if (!req.body.newPassword) {
            console.log("There is no new password.")
        } else if (checkLength > 72 || req.body.newPassword.length < 5) {
            return res.status(400).json("Your password should contain at least 5 characters.");
        }

        if (!req.body.oldPassword) {
            return res.status(400).json("Your password is invalid.");
        }
        
        const result = await editProfileService.editProfile(req.userId, req.body.email.toString(), req.body.oldPassword.toString(), req.body.newPassword.toString());
        res.status(result.status);
        return res.json({ data: result.data, message: result.message });
    }
}

module.exports = accountController;