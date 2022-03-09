const registerService = require("../services/register-service.js");
const loginService = require("../services/login-service.js");
const Constants = require("../constants/index");
const { errorCatch, validEmail, pwdByteLen } = require("../constants/error-catch"),

class accessController {
    async register(req, res) {

        // check if password used is longer than 72 bytes long
        // bcrypt 5.0.1 limitations, only 1st 72 bytes of string are used in hashing
        let checkLength = pwdByteLen(req.body.password);

        // check if email meets all email formatting requirements
        let vEmail = validEmail(req.body.email);
        
        // error checking
        errorCatch(!vEmail, Constants.EMAIL_INVALID);
        errorCatch(!req.body.password || !req.body.username || !req.body.email, Constants.GENERAL_INVALID);
        errorCatch(checkLength > 72 || req.body.password.length < 5, Constants.PASSWORD_CHARS);
        errorCatch(req.body.username.length < 3 || req.body.username.length > 10, Constants.USER_CHARS);

        // if (!req.body.password || !req.body.username || !req.body.email) {
        //     return res.status(400).json({ message: Constants.GENERAL_INVALID });
        // }

        // if (checkLength > 72 || req.body.password.length < 5) {
        //     return res.status(400).json({ message: Constants.PASSWORD_CHARS });
        // }

        // if (req.body.username.length < 3 || req.body.username.length > 10) {
        //     return res.status(400).json({ message: Constants.USER_CHARS });
        // }

        const result = await registerService.register(req.body.email.toString(), req.body.username.toString(), req.body.password.toString());
        
        return res.status(result.status).json({ message: result.message });
    }

    async login(req, res) {

        // error catching
        if (!req.body.email) {
            return res.status(400).json({ message: Constants.EMAIL_INVALID });
        }

        if (!req.body.password) {
            return res.status(400).json({ message: Constants.PASSWORD_INVALID });
        }

        const result = await loginService.login(req.body.email.toString(), req.body.password.toString());

        if (result.status == 200) {
            // Inserting cookies for access and refresh token 
            res.cookie(Constants.REFRESH_TOKEN, result.data.refreshToken, { httpOnly: true, sameSite: "None", secure: true });
            res.cookie(Constants.ACCESS_TOKEN, result.data.accessToken, { httpOnly: true, sameSite: "None", secure: true });
            return res.status(result.status).json({ message: result.message });

        } else if (result.status == 400) {
            return res.status(result.status).json({ message: result.message });
        }
    }
}

module.exports = accessController;