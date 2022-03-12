const registerService = require("../services/register-service.js");
const loginService = require("../services/login-service.js");

const Constants = require("../constants/index");
const { controlErrorCatch, validEmail, pwdByteLen } = require("../constants/error-catch");
const { formatLogMsg, fileNameFormat, controllerFnNameFormat } = require("../services/service-logger/log-format");
const serviceName = fileNameFormat(__filename, __dirname);

class accessController {
    async register(req, res) {

        let fnName = controllerFnNameFormat();

        // check if password used is longer than 72 bytes long
        // bcrypt 5.0.1 limitations, only 1st 72 bytes of string are used in hashing
        let checkLength = pwdByteLen(req.body.password);

        // check if email meets all email formatting requirements
        let vEmail = validEmail(req.body.email);

        // error catch - email is invalid
        controlErrorCatch(
            res, !vEmail, Constants.EMAIL_INVALID, 400,
            Constants.LEVEL_ERROR, serviceName, fnName
        );

        // error catch - password/username/email is invalid
        controlErrorCatch(
            res, !req.body.password || !req.body.username || !req.body.email,
            Constants.GENERAL_INVALID, 400, Constants.LEVEL_ERROR, serviceName, fnName
        );

        // error catch - password is too long/short
        controlErrorCatch(
            res, checkLength > 72 || req.body.password.length < 5, Constants.PASSWORD_CHARS, 400,
            Constants.LEVEL_ERROR, serviceName, fnName
        );

        // error catch - username is too long/short
        // controlErrorCatch(
        //     res, req.body.username.length < 3 || req.body.username.length > 10, Constants.USER_CHARS, 400,
        //     Constants.LEVEL_ERROR, serviceName, fnName
        // );

        if (req.body.username.length < 3 || req.body.username.length > 10) {

            formatLogMsg({
                level: Constants.LEVEL_ERROR,
                serviceName: serviceName,
                fnName: fnName,
                text: Constants.USER_CHARS,
            });
    
            return res.status(400).json({ message: Constants.USER_CHARS });
        }

        const result = await registerService.register(req.body.email.toString(), req.body.username.toString(), req.body.password.toString());

        return res.status(result.status).json({ message: result.message });
    }

    async login(req, res) {

        let fnName = controllerFnNameFormat();

        // error catch - email is invalid
        controlErrorCatch(
            res, !req.body.email, Constants.EMAIL_INVALID, 400,
            Constants.LEVEL_ERROR, serviceName, fnName
        );

        // error catch - password is invalid
        controlErrorCatch(
            res, !req.body.password, Constants.PASSWORD_INVALID, 400,
            Constants.LEVEL_ERROR, serviceName, fnName
        );

        const result = await loginService.login(req.body.email.toString(), req.body.password.toString());

        if (result.status == 200) {

            // Inserting cookies for access and refresh token 
            res.cookie(Constants.REFRESH_TOKEN, result.data.refreshToken, { httpOnly: true, sameSite: "None", secure: true });
            res.cookie(Constants.ACCESS_TOKEN, result.data.accessToken, { httpOnly: true, sameSite: "None", secure: true });
            return res.status(result.status).json({ message: result.message, data: result.data.userType });

        } else if (result.status == 400) {
            return res.status(result.status).json({ message: result.message });
        }
    }

    async logout(req, res) {

        try {
            // Web browsers and other compliant clients will only clear the cookie if the given options is identical to those given to res.cookie(), excluding expires and maxAge.
            res.clearCookie('refreshToken', { httpOnly: true, sameSite: "None", secure: true });
            res.clearCookie('accessToken', { httpOnly: true, sameSite: "None", secure: true });

            res.status(200);
            return res.json({ message: "Logout is successful!" });

        } catch (err) {
            res.status(400);
            return res.json({ message: "Logout is unsuccessful!" });
        }
    }
}

module.exports = accessController;