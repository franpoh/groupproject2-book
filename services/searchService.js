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
                }
            }
        })

        // console.log(swap, !swap);
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

    detail: async (submittedIndexId) => {

        let result = {
            message: null,
            status: null,
            data: null,
        };

        const book = await Index.findByPk(submittedIndexId);

        if (!book) {
            result.message = `Book ID ${submittedIndexId} is not found..`;
            result.status = 404;
            return result;
        };

        result.message = `Book ID ${submittedIndexId} info retrieved..`;
        result.data = book;
        result.status = 200;
        return result;

    },

    searchIndex: async () => {
        let result = {
            message: null,
            status: null,
            data: null,
        };

        // title = title.toLowerCase();
        const index = await Index.findAll();
        // const index = await Index.findAll({
        //     where: {
        //         title: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('title')), 'LIKE', '%' + title + '%'),
        //     }
        // })

        result.data = index;
        result.status = 200;
        result.message = `Books found`
        return result;


    }

};