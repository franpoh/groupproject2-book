// const { where } = require("sequelize/dist");
const { Index, Swap } = require("../connect.js");
const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;


module.exports = {
    search: async (title) => {
        let result = {
            message: null,
            status: null,
            data: null,
        };

        title = title.toLowerCase();
        const swap = await Swap.findAll({
            where: {
                availability: 'YES'
            },
            include: {
                model: Index,
                as: 'Index',
                where: {
                    title: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('title')), 'LIKE', '%' + title + '%'),
                    // title: {
                    //    title // [Op.ne]: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('title')), 'LIKE', '%' + title + '%')
                    // }
                }
            }
        })

        // search from INDEX database WHERE title = ???
        // const book = await Index.findAll({
        //     //findAll partial match
        //     where: {
        //         title: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('title')), 'LIKE', '%' + title + '%')
        //     }
        // });
        // if (!book) {
        //     result.message = `Book titled " ${title} " is not found in our database ...`;
        //     result.status = 404;
        //     return result;
        // }
        console.log(swap, !swap);
        if (swap.length === 0) {
            result.message = `Book titled " ${title} " is not found in our database ...`;
            result.status = 404;
            return result;
        }

        result.data = swap;
        result.status = 200;
        result.message = `Books found with keywords: " ${title} "`
        return result;
    },
};