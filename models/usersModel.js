const { DataTypes, Model } = require("sequelize");

module.exports = function (sequelize) {
    class Users extends Model {}

    Users.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                field: "user_id",
            },
            username: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
                // the properties stated within have to come back true, or it will throw ValidationError
                // Catch error example in README, can be placed in service files
                // validate: {
                //     notEmpty: {
                //         args: true,
                //         msg: "Username field is empty.",
                //     },
                //     len: { // length of string
                //         args: [3, 20], // min, max
                //         msg: "Username has insufficient/too many characters." // msg will show in console
                //     },
                // },
                field: "username",
            },
            email: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
                // validate: {
                //     notEmpty: {
                //         args: true,
                //         msg: "Email field is empty.",
                //     },
                //     len: {
                //         args: [5, 50],
                //         msg: "Email has insufficient/too many characters."
                //     },
                // },
                field: "email",
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                // validate: {
                //     notEmpty: {
                //         args: true,
                //         msg: "Password field is empty.",
                //     },
                //     len: {
                //         args: [8, 50],
                //         msg: "Password has insufficient/too many characters."
                //     },
                // },
                field: "password",
            },
            points: {
                type: DataTypes.INTEGER,
                field: "points",
            },
            createdAt: {
                type: DataTypes.DATE,
                field: "created_at",
            },
            updatedAt: {
                type: DataTypes.DATE,
                field: "updated_at",
            },
        },
        {
            sequelize,
            modelName: "Users",
            tableName: "users",
        }
    );
    return Users;
}