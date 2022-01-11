// const { where } = require("sequelize/dist");
const { Index, Swap } = require("../connect.js");
const { Sequelize } = require("sequelize");


module.exports = {
    search: async (title) => {
        let result = {
            message: null,
            status: null,
            data: null,
        };

        // retrieves books from index database but user wont see availability or conditions of different books 
        const book = await Index.findAll({
            //findAll partial match
            where: {
                title: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('title')), 'LIKE', '%' + title + '%')
            }
        });

        if (!book) {
            result.message = `Book titled " ${title} " is not found in our database ...`;
            result.status = 404;
            return result;
        }

        result.data = book;
        result.status = 200;
        result.message = `Books found for under query: ${title} ...`
        return result;
    },
};