const { DataTypes, Model } = require("sequelize");
const Constants = require("../constants/index");

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
                allowNull: false, // still needed, notNull sets the message
                unique: { // unique is not a validation but a constraint and thus is placed outside
                    args: true,
                    msg: Constants.USER_INUSE,
                },
                // the properties stated within have to come back true, or it will throw ValidationError
                // Catch error example in corresponding service files
                validate: {
                    notNull: {
                        args: true,
                        msg: Constants.USER_INVALID,
                    },
                    notEmpty: {
                        args: true,
                        msg: Constants.USER_INVALID,
                    },
                    len: { // length of string
                        args: [3, 10], // min, max
                        msg: Constants.USER_CHARS,
                    }
                },
                field: "username",
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: {
                    args: true,
                    msg: Constants.EMAIL_INUSE,
                },
                validate: {
                    notNull: {
                        args: true,
                        msg: Constants.EMAIL_INVALID,
                    },
                    notEmpty: {
                        args: true,
                        msg: Constants.EMAIL_INVALID,
                    },
                    isEmail: {
                        args: true,
                        msg: Constants.EMAIL_INVALID,
                    }
                },
                field: "email",
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        args: true,
                        msg: Constants.PASSWORD_INVALID,
                    },
                    notEmpty: {
                        args: true,
                        msg: Constants.PASSWORD_INVALID,
                    }
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
            type: {
                type: DataTypes.STRING, // ADMIN, USER, BANNED
                allowNull: false,
                field: "type",
            },
            imageURL: {
                type: DataTypes.STRING,
                allowNull: true,
                field: "image_url",
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