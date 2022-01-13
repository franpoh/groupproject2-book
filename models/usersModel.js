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
                allowNull: false, // still needed, notNull sets the message
                unique: { // unique is not a validation but a constraint and thus is placed outside
                    args: true,
                    msg: 'Username is already in use.'
                },
                // the properties stated within have to come back true, or it will throw ValidationError
                // Catch error example in corresponding service files
                validate: {
                    notNull: {
                        args: true,
                        msg: 'You need to enter a username.'
                    },
                    notEmpty: {
                        args: true,
                        msg: 'You need to enter a username.'
                    },
                    len: { // length of string
                        args: [3, 10], // min, max
                        msg: 'Your username needs to be between 3 to 10 characters.'
                    }
                },
                field: "username",
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: {
                    args: true,
                    msg: 'Email is already in use.'
                },
                validate: {
                    notNull: {
                        args: true,
                        msg: 'You need to enter a email.'
                    },
                    notEmpty: {
                        args: true,
                        msg: 'You need to enter a email.'
                    },
                    isEmail: {
                        args: true,
                        msg: 'You need to enter a valid email.'
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
                        msg: 'You need to enter a email.'
                    },
                    notEmpty: {
                        args: true,
                        msg: 'You need to enter a password.'
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