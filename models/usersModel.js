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
                // Catch error example in corresponding service files
                validate: {
                    notEmpty: {
                        args: true,
                    },
                    len: { // length of string
                        args: [3, 20], // min, max
                        msg: "Username has insufficient/too many characters." // msg will show in console
                    },
                },
                field: "username",
            },
            email: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
                validate: {
                    notEmpty: {
                        args: true,
                    },
                    len: {
                        args: [5, 50],
                        msg: "Email has insufficient/too many characters."
                    },
                },
                field: "email",
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        args: true,
                    },
                },
                field: "password",
            },
            points: {
                type: DataTypes.INTEGER,
                field: "points",
            },
            wishlist: {
                type: DataTypes.ARRAY(DataTypes.INTEGER), // array of integers
                field: "wishlist",
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