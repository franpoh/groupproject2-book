const { ValidationError } = require("sequelize"); // Validation Error is a class item

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

        const hash = bcrypt.hashSync(password, saltRounds);

        // try/catch function for catching Validation Errors
        try {
            const user = await Users.create({ email: email, username: username, password: hash });
            console.log("User Created: ", user instanceof Users);
            result.data = JSON.stringify(user);
            result.status = 200;
            result.message = "Your registration is successful!";
            return result;
        } catch (error) {
            // Check whether an object (error) is an instance of a specific class (ValidationError)
            if (error instanceof ValidationError) {
                console.error("This is a validation error: ", error)
                result.status = 400;
                result.message = "Your email / username / password is invalid";
                return result;
            } 
            console.error(error);
        }
    }
}