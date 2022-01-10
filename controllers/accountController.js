const registerService = require("../services/registerService.js");
const loginService = require("../services/loginService.js");
const profileService = require("../services/profileService.js");

class accountController {
    async register (req, res) {
        // invalid email catching (PUT INTO MODEL INSTEAD)
        if (!req.body.email.includes("@")) {
            res.status(400);
            return res.send("You have entered an invalid email.");
        }
        
        console.log("Registration Details: ", req.body);
        const result = await registerService.register(req.body.email, req.body.username, req.body.password);
        res.status(result.status);
        return res.json({ data: result.data, message: result.message });
    }

    async login (req, res) {
        console.log("Login Details: ", req.body);
        const result = await loginService.login(req.body.email, req.body.password);
        res.status(result.status);
        return res.json({ data: result.data, message: result.message });
    }

    async viewProfile(req, res) {
        const result = await profileService.viewProfile(req.username); // using values passed from authenticateJwt
        res.status(result.status);
        return res.json({ data: result.data, message: result.message });
    }
}

module.exports = accountController;