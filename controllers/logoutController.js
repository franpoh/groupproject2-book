const logoutService = require("../services/logoutService");

class logoutController {
    async logout(req, res) {
        // const result = await logoutService.logout(req.cookies);
        try {
            const { accessToken, refreshToken } = req.cookies;

            res.clearCookie('refreshToken', refreshToken, {path: "/", domain: "book-libraryshop.herokuapp.com", httpOnly: true, sameSite: "None", secure: true});
            res.clearCookie('accessToken', accessToken, {path: "/", domain: "book-libraryshop.herokuapp.com", httpOnly: true, sameSite: "None", secure: true});
            
            return res.status(204).json({ message: "Your logout is successful!" });
        } catch (err) {
            return res.status(400).json({ message: "Your logout is unsuccessful!" });
        }

        // return res.status(result.status).json({ data: result.data, message: result.message });
    }
}

module.exports = logoutController;