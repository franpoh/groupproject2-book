const { DataTypes, Model } = require("sequelize");

module.exports = function (sequelize) {
    class Swap extends Model {}

    Swap.init (
        {
            swapId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                field: "swap_id",
            },
            price: {
                type: DataTypes.INTEGER,
                field: "price",
                allowNull: false,
            },
            comments: {
                type: DataTypes.STRING,
                field: "comments",
            },
            indexId: {
                type: DataTypes.INTEGER,
                field: "index_id",
                allowNull: false,
            },
            userId: {
                type: DataTypes.INTEGER,
                field: "user_id",
                allowNull: false,
            },
            availability: {
                type: DataTypes.STRING, // YES or NO
                field: "availability",
                allowNull: false,
            },
            purchasedId: {
                type: DataTypes.INTEGER,
                field: "purchased_id",
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
            modelName: "Swap",
            tableName: "swap",
        }
    );
    return Swap;
}