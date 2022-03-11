// const { where } = require("sequelize/dist");
const { Index, Swap, Users, Genres, Reviews } = require("../connect.js");
const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;
const Constants = require("../constants/index.js");

const logger = require("./service-logger/file-logger");
// const serviceName = 'search-service';
const serviceName = __filename.slice(__dirname.length + 1, -3);
// const serviceFn01 = 'search';
const serviceFn02 = 'detail';
const serviceFn03 = 'searchIndexByParams';

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
                availability: Constants.AVAIL_YES
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
        
        const book = await Index.findAll({
            where: {
                indexId: submittedIndexId,
            },
            include: {
                model: Genres,
                attributes: ['genre']
            },
        });

        if (!book) {
            result.message = `Book ID ${submittedIndexId} is not found..`;
            // logger.error(`<<<<<<<<<<${serviceName}-[${serviceFn02}]: ${result.message}>>>>>>>>>>`);
            result.status = 404;
            return result;
        };

        result.message = `Book ID ${submittedIndexId} info retrieved..`;
        result.data = book;
        result.status = 200;
        // logger.info(`<<<<<<<<<<${serviceName}-[${serviceFn02}]: ${result.message}>>>>>>>>>>`);
        return result;

    },

    searchIndexByParams: async (booktitle, bookauthor) => {
        let result = {
            message: null,
            status: null,
            data: null,
        };

        if (booktitle == '' && bookauthor == '') {
            result.message = `Please provide at least one parameter to retrieve info`
            result.status = 404;
            // logger.error(`<<<<<<<<<<${serviceName}-[${serviceFn03}]: ${result.message}>>>>>>>>>>`);
            return result
        };

        const filtered = await Index.findAll({
            where: {
                [Op.or]: [
                    { title: booktitle },
                    { author: bookauthor }
                ]
            }
        });

        if (booktitle != '' && bookauthor == '') {
            result.message = `Retrieving books with books titled ${booktitle}`
            result.status = 200;
            result.data = filtered;
            // logger.info(`<<<<<<<<<<${serviceName}-[${serviceFn03}]: ${result.message}>>>>>>>>>>`);
            return result;
        };

        if (bookauthor != '' && booktitle == '') {
            result.message = `Retrieving books with authors named ${bookauthor}`
            result.status = 200;
            result.data = filtered;
            // logger.info(`<<<<<<<<<<${serviceName}-[${serviceFn03}]: ${result.message}>>>>>>>>>>`);
            return result;
        };

        result.message = `Retrieving books with books titled ${booktitle} by authors named ${bookauthor}`
        result.status = 200;
        result.data = filtered;
        // logger.info(`<<<<<<<<<<${serviceName}-[${serviceFn03}]: ${result.message}>>>>>>>>>>`);
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
        if (!index) {
            result.message = `Index data not found in database`;
            result.status = 404;
            return result;
        };

        result.data = index;
        result.status = 200;
        result.message = `Books found`
        return result;


    },

    searchSwapByIndex: async (submittedIndexId) => {
        
        let result = {
            message: null,
            status: null,
            data: null,
        };

        let fnName = (new Error()).stack.split("\n")[2].trim().split(" ")[1];
        let logmessage = {
            serviceName: serviceName,
            fnName: fnName,
            text: result.message
        };

        const swapForIndex = await Swap.findAll({
            // not working
            // attributes: {
            //     exclude: [ 'user_id_purchased' ]
            // } ,
            where: {
                indexId: submittedIndexId,
                availability: Constants.AVAIL_YES
            },
            // not working
            // include: {
            //     model: Users,                
            //     // where: {
            //     //     user_id: { [Op.col] : 'Swap.user_id' }
            //     // }
            // }
        });
        try {
            if (swapForIndex.length !== 0) {

                let xx;

                let testArray = [];

                for (xx = 0; xx < swapForIndex.length; xx++) {
                    const matchUserName = await Users.findByPk(swapForIndex[xx].userId);
                    // (swapForIndex[xx])['username'] = matchUserName.username;                    
                    testArray[xx] = { data: swapForIndex[xx], username: matchUserName.username };
                };

                result.data = testArray;
                result.status = 200;
                result.message = `Book ID ${submittedIndexId} has swap available for purchase`;
                // logger.info(`<<<<<<<<<<${serviceName}-[${fnName}]: ${result.message}>>>>>>>>>>`);
                logger.info(logmessage);
                return result;
            };
        } catch (error) {
            result.status = 404;
            result.message = `Swap error: ${error}`;
            // logger.error(`<<<<<<<<<<${serviceName}-[${fnName}]: ${result.message}>>>>>>>>>>`);
            logger.info(logmessage);
            return result;

        };


        result.data = swapForIndex;
        result.status = 200;
        result.message = `Book ID ${submittedIndexId} swap available for purchase is Zero`;
        // logger.info(`<<<<<<<<<<${serviceName}-[${fnName}]: ${result.message}>>>>>>>>>>`);
        logger.info(logmessage);
        return result;
    },

    allReviews: async (paramsId) => {
        let result = {
            message: null,
            status: null,
            data: null,
        };
        const review = await Reviews.findAll();
        const byIndex = await Reviews.findAll({
            where: {
                indexId: paramsId
            },
            include: {
                model: Users,
                attributes: ['username']
            }
        })

        if (paramsId === 0) {
            result.data = review;
            result.message = `reviews retrieved`;
            result.status = 200;
            return result;
        };

        result.data = byIndex;
        result.status = 200;
        result.message = `reviews of book index ${paramsId}`
        return result;

    },

    allGenres: async () => {
        let result = {
            message: null,
            status: null,
            data: null
        };

        try {
            const allGenres = await Genres.findAll();
            result.data = allGenres;
            result.message = "All Genres Retrieved";
            result.status = 200;
            return result;
        } catch (err) {
            result.status = 404;
            result.message = `Genre Retrieval Error: ${error}`;
            return result;
        };

    }
};