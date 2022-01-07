const { DataTypes, Model } = require("sequelize");

module.exports = function (sequelize) {
    class Reviews extends Model {}

    Reviews.init (
        {
            reviewId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                field: "review_id",
            },
            review: {
                type: DataTypes.STRING,
                allowNull: false,
                field: "review",
            },
            userId: {
                type: DataTypes.INTEGER,
                field: "user_id",
                allowNull: false,
            },
            indexId: {
                type: DataTypes.INTEGER,
                field: "index_id",
                allowNull: false,
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
            modelName: "Reviews",
            tableName: "reviews",
        }
    );
    return Reviews;
}