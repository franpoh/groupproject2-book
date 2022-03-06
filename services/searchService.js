// const { where } = require("sequelize/dist");
const { Index, Swap, Users, Genres, Reviews } = require("../connect.js");
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

        // const book = await Index.findByPk(submittedIndexId, {
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

        const swapForIndex = await Swap.findAll({
            // not working
            // attributes: {
            //     exclude: [ 'user_id_purchased' ]
            // } ,
            where: {
                indexId: submittedIndexId,
                availability: 'YES'
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
            if (swapForIndex.length !== 0){

                let xx;

                let testArray = [];

                for(xx=0; xx < swapForIndex.length; xx++){
                    const matchUserName = await Users.findByPk(swapForIndex[xx].userId);
                    // (swapForIndex[xx])['username'] = matchUserName.username;                    
                    // testArray[xx] = { data: testArray[xx], username: matchUserName.username };
                    testArray[xx] = { data: testArray[xx] };
                    testArray[xx].data.username = matchUserName.username;
                    
                };

                result.data = testArray;
                result.status = 200;
                result.message = `Swap available for purchase`;
                return result;
            };
        } catch(error) {
            result.status = 403;
            result.message = `Swap error: ${error}`;
            return result;

        };
        

        result.data = swapForIndex;
        result.status = 200;
        result.message = `Swap available for purchase ${swapForIndex[0].username}`;
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
};