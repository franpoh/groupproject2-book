const viewProfileService = require("../services/viewProfileService");
const editProfileService = require("../services/editProfileService")

class accountController {
    async viewProfile(req, res) {
        const result = await viewProfileService.viewProfile(req.userId); // using values passed from authenticateJwt
        res.status(result.status);
        return res.json({ data: result.data, message: result.message });
    }

    async editProfile(req, res) {
        const result = await editProfileService.editProfile(req.userId, req.body.email, req.body.password);
        res.status(result.status);
        return res.json({ data: result.data, message: result.message });
    }
}

module.exports = accountController;