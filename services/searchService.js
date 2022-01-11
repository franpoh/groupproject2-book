const { Index } = require("../connect.js");


module.exports = {
    search: async (title) => {
        let result = {
            message: null,
            status: null,
            data: null,
        };
        const book = await Index.findOne({
            //findAll partial match
            where: {
                title: title
            }
        });

        if (!book) {
            result.message = `Book titled " ${title} " is not found in our database ...`;
            result.status = 404;
            return result;
        }

        result.data = book;
        result.status = 200;
        result.message = `Book found for query: ${title} ...`
        return result;
    },
};