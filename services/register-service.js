const { ValidationError } = require("sequelize"); // Validation Error is a class item
const Constants = require("../constants/index.js");
const { serviceErrorCatch } = require("../constants/error-catch");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const { Users } = require("../connect.js");

module.exports = {
    register: async (email, username, password) => {
        let result = {
            message: null,
            status: null,
            data: null,
        }

        // Error catching for email/username already in use
        const findUser = Users.findAll({ where: { username: username }});
        const findEmail = Users.findAll({ where: { email: email }});

        serviceErrorCatch(result, findUser, Constants.USER_INUSE, 409);
        serviceErrorCatch(result, findEmail, Constants.EMAIL_INUSE, 409);

        // if (findUser) {
        //     result.status = 200;
        //     result.message = Constants.USER_INUSE;
        //     return result;
        // }

        // if (findEmail) {
        //     result.status = 200;
        //     result.message = Constants.EMAIL_INUSE;
        //     return result;
        // }

        // try/catch function for catching Validation Errors specified in models
        try {
            const hash = bcrypt.hashSync(password, saltRounds);

            // validation error is caught during Users.create, as it is being pointed to the columns
            const user = await Users.create({ email: email, username: username, password: hash, type: Constants.USER_USER });

            result.status = 200;
            result.message = "Your registration is successful!";
            return result;
        } catch (error) {
            // Check whether an object (error) is an instance of a specific class (ValidationError)

            serviceErrorCatch(result, error instanceof ValidationError, error.errors[0].message, 400)

            // if (error instanceof ValidationError) {
            //     console.error("This is a validation error: ", error);
            //     result.message = error.errors[0].message;
            //     result.status = 400;
            //     return result;
            // }

            result.message = error.errors[0].message;
            result.status = 400;
            return result;
        }
    }
}