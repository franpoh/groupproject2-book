// const { where } = require("sequelize/dist");
const { Index, Swap, Users, Genres, Reviews } = require("../connect.js");
const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;
const Constants = require("../constants/index.js");

const { formatLogMsg, fileNameFormat, fnNameFormat } = require("./service-logger/log-format");

const serviceName = fileNameFormat(__filename, __dirname);

module.exports = {
    search: async (title) => {

        let fnName = fnNameFormat();

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

            formatLogMsg({
                level: Constants.LEVEL_ERROR,
                serviceName: serviceName,
                fnName: fnName,
                text: result.message
            });

            return result;
        }

        result.data = swap;
        result.status = 200;
        result.message = `Books found with keywords: " ${title} "`;

        formatLogMsg({
            level: Constants.LEVEL_INFO,
            serviceName: serviceName,
            fnName: fnName,
            text: result.message
        });

        return result;
    },

    detail: async (submittedIndexId) => {

        let fnName = fnNameFormat();

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

        if (book.length === 0) {
            result.message = `Book ID ${submittedIndexId} is not found..`;
            result.status = 404;

            formatLogMsg({
                level: Constants.LEVEL_ERROR,
                serviceName: serviceName,
                fnName: fnName,
                text: result.message
            });

            return result;
        };

        result.message = `Book ID ${submittedIndexId} info retrieved..`;
        result.data = book;
        result.status = 200;

        formatLogMsg({
            level: Constants.LEVEL_INFO,
            serviceName: serviceName,
            fnName: fnName,
            text: result.message
        });

        return result;

    },

    searchIndexByParams: async (booktitle, bookauthor) => {

        let fnName = fnNameFormat();

        let result = {
            message: null,
            status: null,
            data: null,
        };

        if (booktitle == '' && bookauthor == '') {
            result.message = `Please provide at least one parameter to retrieve info`
            result.status = 404;

            formatLogMsg({
                level: Constants.LEVEL_ERROR,
                serviceName: serviceName,
                fnName: fnName,
                text: result.message
            });

            return result;
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

            formatLogMsg({
                level: Constants.LEVEL_INFO,
                serviceName: serviceName,
                fnName: fnName,
                text: result.message
            });

            return result;
        };

        if (bookauthor != '' && booktitle == '') {
            result.message = `Retrieving books with authors named ${bookauthor}`
            result.status = 200;
            result.data = filtered;

            formatLogMsg({
                level: Constants.LEVEL_INFO,
                serviceName: serviceName,
                fnName: fnName,
                text: result.message
            });

            return result;
        };

        result.message = `Retrieving books with books titled ${booktitle} by authors named ${bookauthor}`
        result.status = 200;
        result.data = filtered;

        formatLogMsg({
            level: Constants.LEVEL_INFO,
            serviceName: serviceName,
            fnName: fnName,
            text: result.message
        });

        return result;
    },

    searchIndex: async () => {

        let fnName = fnNameFormat();

        let result = {
            message: null,
            status: null,
            data: null,
        };

        const index = await Index.findAll();

        if (index.length === 0) {
            result.message = `Index data not found in database`;
            result.status = 404;

            formatLogMsg({
                level: Constants.LEVEL_ERROR,
                serviceName: serviceName,
                fnName: fnName,
                text: result.message
            });

            return result;
        };

        result.data = index;
        result.status = 200;
        result.message = `Books found`;

        formatLogMsg({
            level: Constants.LEVEL_INFO,
            serviceName: serviceName,
            fnName: fnName,
            text: result.message
        });

        return result;
    },

    searchSwapByIndex: async (submittedIndexId) => {

        let fnName = fnNameFormat();

        let result = {
            message: null,
            status: null,
            data: null,
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

                formatLogMsg({
                    level: Constants.LEVEL_INFO,
                    serviceName: serviceName,
                    fnName: fnName,
                    text: result.message
                });

                return result;
            };
        } catch (error) {
            result.status = 404;
            result.message = `Swap error: ${error}`;

            formatLogMsg({
                level: Constants.LEVEL_ERROR,
                serviceName: serviceName,
                fnName: fnName,
                text: result.message
            });

            return result;
        };

        result.data = swapForIndex;
        result.status = 200;
        result.message = `Book ID ${submittedIndexId} swap available for purchase is Zero`;

        formatLogMsg({
            level: Constants.LEVEL_INFO,
            serviceName: serviceName,
            fnName: fnName,
            text: result.message
        });

        return result;
    },

    allReviews: async (paramsId) => {

        let fnName = fnNameFormat();

        let result = {
            message: null,
            status: null,
            data: null,
        };
        
        const byIndex = await Reviews.findAll({
            where: {
                indexId: paramsId
            },
            include: {
                model: Users,
                attributes: ['username']
            }
        })

        if (byIndex.length === 0) {
            result.data = byIndex;
            result.message = `reviews does not exist for book id:${paramsId}`;
            result.status = 200;

            formatLogMsg({
                level: Constants.LEVEL_INFO,
                serviceName: serviceName,
                fnName: fnName,
                text: result.message
            });

            return result;
        };        

        result.data = byIndex;
        result.status = 200;
        result.message = `all reviews of book index ${paramsId} retrieved`

        formatLogMsg({
            level: Constants.LEVEL_INFO,
            serviceName: serviceName,
            fnName: fnName,
            text: result.message
        });

        return result;

    },

    allGenres: async () => {

        let fnName = fnNameFormat();

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

            formatLogMsg({
                level: Constants.LEVEL_INFO,
                serviceName: serviceName,
                fnName: fnName,
                text: result.message
            });

            return result;
        } catch (err) {
            result.status = 404;
            result.message = `Genre Retrieval Error: ${error}`;

            formatLogMsg({
                level: Constants.LEVEL_ERROR,
                serviceName: serviceName,
                fnName: fnName,
                text: result.message
            });

            return result;
        };

    }
};