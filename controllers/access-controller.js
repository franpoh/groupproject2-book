const registerService = require("../services/register-service.js");
const loginService = require("../services/login-service.js");

const Constants = require("../constants/index");

const { errorCatch, validEmail, pwdByteLen, infoLog } = require("../constants/error-catch");
const { fileNameFormat, controllerFnNameFormat } = require("../services/service-logger/log-format");
const serviceName = fileNameFormat(__filename, __dirname);



// ----------------------------------------- PASSED TO GENERAL ROUTES
class accessController {

    // ----------------------------------------- REGISTER
    async register(req, res) {

        let fnName = controllerFnNameFormat();

        // check if password used is longer than 72 bytes long
        // bcrypt 5.0.1 limitations, only 1st 72 bytes of string are used in hashing
        let checkLength = pwdByteLen(req.body.password);

        // check if email meets all email formatting requirements
        let vEmail = validEmail(req.body.email);

        // error catch - email is invalid
        if (!vEmail) {
            let result = errorCatch(400, Constants.EMAIL_INVALID, serviceName, fnName);
            return res.status(result.status).json({ message: result.message });
        }

        // error catch - password/username/email is invalid (not filled in)
        if (!req.body.password || !req.body.username || !req.body.email) {
            let result = errorCatch(400, Constants.GENERAL_INVALID, serviceName, fnName);
            return res.status(result.status).json({ message: result.message });
        }

        // error catch - password is too long/short
        if (checkLength > 72 || req.body.password.length < 5) {
            let result = errorCatch(400, Constants.PASSWORD_CHARS, serviceName, fnName);
            return res.status(result.status).json({ message: result.message });
        }

        // error catch - username is too long/short
        if (req.body.username.length < 3 || req.body.username.length > 10) {
            let result = errorCatch(400, Constants.USER_CHARS, serviceName, fnName);
            return res.status(result.status).json({ message: result.message });
        }

        const result = await registerService.register(req.body.email.toString(), req.body.username.toString(), req.body.password.toString());

        return res.status(result.status).json({ message: result.message });
    }

    // ----------------------------------------- LOGIN
    async login(req, res) {

        let fnName = controllerFnNameFormat();

        // error catch - email is invalid
        if (!req.body.email) {
            let result = errorCatch(400, Constants.EMAIL_INVALID, serviceName, fnName);
            return res.status(result.status).json({ message: result.message });
        }

        // error catch - password is invalid
        if (!req.body.password) {
            let result = errorCatch(400, Constants.PASSWORD_INVALID, serviceName, fnName);
            return res.status(result.status).json({ message: result.message });
        }

        const result = await loginService.login(req.body.email.toString(), req.body.password.toString());

        if (result.status == 200) {

            // Inserting cookies for jwt access and refresh token 
            res.cookie(Constants.REFRESH_TOKEN, result.data.refreshToken, { httpOnly: true, sameSite: "None", secure: true });
            res.cookie(Constants.ACCESS_TOKEN, result.data.accessToken, { httpOnly: true, sameSite: "None", secure: true });

            return res.status(result.status).json({ message: result.message, data: result.data.userType });

        } else if (result.status == 400) {
            return res.status(result.status).json({ message: result.message });
        }
    }

    // ----------------------------------------- LOGOUT
    async logout(req, res) {

        let fnName = controllerFnNameFormat();

        try {
            // Web browsers and other compliant clients will only clear the cookie if the given options is identical to those given to res.cookie(), excluding expires and maxAge.
            res.clearCookie('refreshToken', { httpOnly: true, sameSite: "None", secure: true });
            res.clearCookie('accessToken', { httpOnly: true, sameSite: "None", secure: true });

            let result = infoLog("Logout is successful!", serviceName, fnName);
            return res.status(result.status).json({ message: result.message });

        } catch (err) {
            let result = errorCatch(400, "Logout is unsuccessful!", serviceName, fnName);
            return res.status(result.status).json({ message: result.message });
        }
    }
}

module.exports = accessController;