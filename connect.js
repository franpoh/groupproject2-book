const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
    database: process.env.DATABASE,
    username: process.env.USER_NAME,
    password: process.env.PASSWORD,
    host: process.env.DB_HOST,
    port: 5432,
    dialect: "postgres",
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // in lieu of a CA for SSL, not recommended
        }
    },
});

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully!");
        return true;
    } catch (error) {
        console.log("Unable to connect to the database: ", error);
        return false;
    }
}

const Users = require("./models/users-model.js")(sequelize);
const Index = require("./models/index-model.js")(sequelize);
const Genres = require("./models/genres-model.js")(sequelize);
const Reviews = require("./models/reviews-model.js")(sequelize);
const Swap = require("./models/swap-model.js")(sequelize);

Index.belongsTo(Genres, {
    foreignKey: "genreId"
});

Reviews.belongsTo(Users, {
    foreignKey: "userId"
});

Reviews.belongsTo(Index, {
    foreignKey: "indexId"
});

// Swap.belongsTo(Users, {
//     foreignKey: "userId"
// });

Users.hasMany(Swap, {
    foreignKey: "userId"
});

Users.hasMany(Swap, {
    foreignKey: "purchasedId"
});

Swap.belongsTo(Users, {
    foreignKey: "userId"
});

Swap.belongsTo(Users, {
    foreignKey: "purchasedId"
});

Swap.belongsTo(Index, {
    foreignKey: "indexId"
});

module.exports = {
    sequelize,
    testConnection,
    Users,
    Index,
    Swap,
    Genres,
    Reviews,
}