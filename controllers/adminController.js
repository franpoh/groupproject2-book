const userTypeService = require("../services/userTypeService.js");

class AdminController {
    async editUserType(req, res) {
        const userTypes = ["user", "admin", "ban"];

        if (!req.body.username) {
            res.status(400)
            return res.send("The username is invalid. Please input username of user that you wish to edit.");
        }

        if (!req.body.password) {
            res.status(400)
            return res.send("Your password is invalid. Please confirm password before proceeding.");
        }

        if (!req.body.type || !userTypes.some(item => req.body.type === item)) {
            res.status(400);
            return res.send("The user type is invalid. Please input 'user', 'ban', or 'admin'.");
        }

        const editUsername = req.body.username.toString();

        const result = await userTypeService.editUserType(editUsername, req.body.type, req.body.password, req.userId);
        res.status(result.status);
        return res.json({ data: result.data, message: result.message });
    }   
}

module.exports = AdminController;