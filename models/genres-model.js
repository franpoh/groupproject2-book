const { DataTypes, Model } = require("sequelize");

module.exports = function (sequelize) {
    class Genres extends Model {}

    Genres.init (
        {
            genreId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                field: "genre_id",
            },
            genre: {
                type: DataTypes.STRING,
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
            modelName: "Genres",
            tableName: "genres",
        }
    );
    return Genres;
}