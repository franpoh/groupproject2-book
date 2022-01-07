const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
    database: "de5u9v34pd7oan",
    username: "brubkewgaxhgsv",
    password: "6a46eab1dd532c2ce017c4004757a717b654c3c25640a441fa23f21ba26a23cc",
    host: "ec2-54-172-219-6.compute-1.amazonaws.com",
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

const Users = require ("./models/usersModel.js")(sequelize);
const Index = require ("./models/indexModel.js")(sequelize);
const Genres = require ("./models/genresModel.js")(sequelize);
const Reviews = require ("./models/reviewsModel.js")(sequelize);
const Swap = require ("./models/swapModel.js")(sequelize);

Index.belongsTo(Genres, {
    foreignKey:"genreId"
});

Reviews.belongsTo(Users, {
    foreignKey:"userId"
});

Reviews.belongsTo(Index, {
    foreignKey:"indexId"
});

Swap.belongsTo(Users, {
    foreignKey:"userId"
});

Swap.belongsTo(Index, {
    foreignKey:"indexId"
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