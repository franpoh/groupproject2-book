const logoutService = require("../services/logoutService");

class logoutController {
    async logout(req, res) {
        const result = await logoutService.logout();
        return res.status(result.status).json({ data: result.data, message: result.message });
    }
}

module.exports = logoutController;