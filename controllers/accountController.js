const profileService = require("../services/profileService.js");

class accountController {
    async viewProfile(req, res) {
        const result = await profileService.viewProfile(req.username); // using values passed from authenticateJwt
        res.status(result.status);
        return res.json({ data: result.data, message: result.message });
    }

    async editProfile(req, res) {
        const result = await profileService.editProfile(req.username, req.body.email, req.body.password);
        res.status(result.status);
        return res.json({ data: result.data, message: result.message });
    }
}

module.exports = accountController;