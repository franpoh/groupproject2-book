const bcrypt = require("bcrypt");
const saltRounds = 10;

const Constants = require("../constants/index");

const { errorCatch, infoLog } = require("../constants/error-catch");
const { ValidationError } = require("sequelize"); // Validation Error is a class item
const { formatLogMsg, fileNameFormat, fnNameFormat } = require("./service-logger/log-format");
const serviceName = fileNameFormat(__filename, __dirname);

const { Users } = require("../connect.js");

module.exports = {
    editProfile: async (userId, email, oldPassword, newPassword) => {

        let fnName = fnNameFormat();

        // let result = {
        //     message: null,
        //     status: null,
        //     data: null,
        // }

        const user = await Users.findByPk(userId);
        const findEmail = await Users.findAll({ where: { email: email } });

        console.log("EDIT PROFILE", findEmail);

        // error catch - if user doesn't exist
        if (!user) {
            let response = errorCatch(404, Constants.LEVEL_ERROR, serviceName, fnName);
            return response;
        }

        // error catch - if email is in use
        if (findEmail) {
            let response = errorCatch(409, Constants.EMAIL_INUSE, serviceName, fnName);
            return response;
        }

        // verify password
        const passwordVerification = await bcrypt.compare(oldPassword, user.password);

        // error catch - if password does not exist
        if (!passwordVerification) {
            let response = errorCatch(400, Constants.PASSWORD_INVALID, serviceName, fnName);
            return response;
        }

        try {
            // If new email/password not specified, use old email/password
            let newEmail = !email ? user.email : email;
            let newPwd = !newPassword ? user.password : bcrypt.hashSync(newPassword, saltRounds);

            // Message depending on what was edited
            let newMsg = !newPassword ? "Profile Updated!" : "Password Updated! Logging you out..."

            // set new email and/or password
            user.email = newEmail;
            user.password = newPwd;
            await user.save();

            // infolog
            let response = infoLog(newMsg, serviceName, fnName);
            response.data = JSON.stringify(user);
            return response;

            // result.status = 200;
            // result.message = newMsg;

            // // winston logging
            // formatLogMsg({
            //     level: Constants.LEVEL_INFO,
            //     serviceName: serviceName,
            //     fnName: fnName,
            //     text: result.message
            // });

            // return result;

        } catch (error) {
            // error catching from model validation as backup
            if (error instanceof ValidationError) {
                let response = errorCatch(400, error.errors[0].message, serviceName, fnName);
                return response;
            }

            let response = errorCatch(400, error.errors[0].message, serviceName, fnName);
            return response;

            // result.message = error.errors[0].message;
            // result.status = 400;

            // // winston logging
            // formatLogMsg({
            //     level: Constants.LEVEL_ERROR,
            //     serviceName: serviceName,
            //     fnName: fnName,
            //     text: result.message
            // });

            // return result;
        }
    }
}