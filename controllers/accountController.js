const viewProfileService = require("../services/viewProfileService");
const editProfileService = require("../services/editProfileService")

class accountController {
    async viewProfile(req, res) {
        const result = await viewProfileService.viewProfile(req.userId); // using values passed from authenticateJwt
        res.status(result.status);
        return res.json({ data: result.data, message: result.message });
    }

    async editProfile(req, res) {
        let checkLength = new TextEncoder().encode(req.body.password).length;
        console.log("Checking byte length: ", checkLength);

        if (req.body.password == undefined || checkLength > 72 || req.body.password.length < 5) {
            res.status(400)
            return res.send("Your password is invalid. Please ensure that it contains at least 5 charaters.");
        }
        
        const result = await editProfileService.editProfile(req.userId, req.body.email, req.body.password);
        res.status(result.status);
        return res.json({ data: result.data, message: result.message });
    }
}

module.exports = accountController;