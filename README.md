Example for catching validation errors:

// service file
module.exports = {
    register: async (email, pwd) => {
        let result = {
            message: null,
            status: null,
            data: null,
        }

        const hash = bcrypt.hashSync(pwd, saltRounds);

        // try/catch function for catching Validation Errors
        try {
            const user = await User.create({ email: email, pwd: hash });
            console.log("User Created: ", user instanceof User);
            result.data = JSON.stringify(user);
            result.status = 200;
            result.message = "Your registration is successful!";
            return result;
        } catch (error) {
            // Check whether an object (error) is an instance of a specific class (ValidationError)
            if (error instanceof ValidationError) {
                console.error("This is a validation error: ", error)
                result.status = 400;
                result.message = "Your email / password is invalid";
                return result;
            } 
            console.error(error);
        }
    },
    
    ... 
}

// controller file
 async register (req, res) {
        if (!req.body.email.includes("@")) {
            res.status(400);
            return res.send("You have entered an invalid email.");
        }
        
        console.log("Registration Details: ", req.body);
        const result = await userService.register(req.body.email, req.body.pwd);
        res.status(result.status);
        return res.json({ data: result.data, message: result.message });
    }

    ...
}

