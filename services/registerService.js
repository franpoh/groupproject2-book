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

        // try/catch function for catching Validation Errors
        try {
            const hash = bcrypt.hashSync(password, saltRounds);
            // validation error is caught during Users.create, anything above or during will result in error
            const user = await Users.create({ email: email, username: username, password: hash });
            console.log("User Created: ", user instanceof Users);
            result.data = JSON.stringify(user);
            result.status = 200;
            result.message = "Your registration is successful!";
            return result;
        } catch (error) {
            // Check whether an object (error) is an instance of a specific class (ValidationError)
            if (error instanceof ValidationError) {
                console.error("This is a validation error: ", error);

                if (error.toString().includes("username")) {
                    result.message = "Your username is invalid.";
                } else if (error.toString().includes("email")) {
                    result.message = "Your email is invalid.";
                } else {
                    result.message = "Your password is invalid.";
                }
                result.status = 400;
                return result;
            } 
            console.error("Other Errors", error);
        }
    }
}