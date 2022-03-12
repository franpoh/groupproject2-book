const Constants = require("../constants/index.js");

const { ValidationError } = require("sequelize"); // Validation Error is a class item
const { errorCatch, infoLog } = require("../constants/error-catch");
const { formatLogMsg, fileNameFormat, fnNameFormat } = require("./service-logger/log-format");
const serviceName = fileNameFormat(__filename, __dirname);

const bcrypt = require("bcrypt");
const saltRounds = 10;

const { Users } = require("../connect.js");

module.exports = {
    register: async (email, username, password) => {

        let fnName = fnNameFormat();

        // let result = {
        //     message: null,
        //     status: null,
        //     data: null,
        // }

        const findUser = await Users.findAll({ where: { username: username } });
        const findEmail = await Users.findAll({ where: { email: email } });

        // Error catch - username already in use
        if (findUser.length >= 1) {
            let response = errorCatch(409, Constants.USER_INUSE, serviceName, fnName);
            return response;
        }

        // error catch - email already in use
        if (findEmail.length >= 1) {
            let response = errorCatch(409, Constants.EMAIL_INUSE, serviceName, fnName);
            return response;
        }

        // try/catch function for catching Validation Errors specified in models
        try {
            // create password hash
            const hash = bcrypt.hashSync(password, saltRounds);

            // validation error is caught during Users.create, as it is being pointed to the columns
            const user = await Users.create({
                email: email,
                username: username,
                password: hash,
                type: Constants.USER_USER,
                imageURL: "https://i.pinimg.com/736x/2d/cf/63/2dcf63c23e359dd5fec6ced32d4d8805.jpg"
            });

            // infolog
            let response = infoLog("Your registration is successful!", serviceName, fnName);
            return response;

            // result.status = 200;
            // result.message = "Your registration is successful!";

            // // winston logging
            // formatLogMsg({
            //     level: Constants.LEVEL_INFO,
            //     serviceName: serviceName,
            //     fnName: fnName,
            //     text: result.message
            // });

            // return result;
        } catch (error) {

            // Check whether an object (error) is an instance of a specific class (ValidationError)
            if (error instanceof ValidationError) {
                let response = errorCatch(400, error.errors[0].message, serviceName, fnName);
                return response;
            }

            let response = errorCatch(400, error.errors[0].message, serviceName, fnName);
            return response;

            // result.message = error.errors[0].message;
            // result.status = 400;
            // return result;
        }
    }
}