const { DataTypes, Model } = require("sequelize");

module.exports = function (sequelize) {
    class Index extends Model { }

    Index.init(
        {
            indexId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                field: "index_id",
            },
            title: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
                field: "title",
            },
            author: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
                field: "author",
            },
            year: {
                type: DataTypes.INTEGER,
                field: "year",
            },
            genreId: {
                type: DataTypes.INTEGER,
                field: "genre_id",
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
            modelName: "Index",
            tableName: "index",
        }
    );
    return Index;
}