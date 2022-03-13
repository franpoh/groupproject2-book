const { Index, Users, Swap } = require("../connect.js");
const Constants = require("../constants/index.js");

const { formatLogMsg, fileNameFormat, fnNameFormat }= require("./service-logger/log-format");

const serviceName = fileNameFormat( __filename, __dirname );

module.exports = {

    addToWish: async (submittedUserId, submittedIndexId) => {

        let fnName = fnNameFormat();

        let result = {
            message: null,
            status: null,
            data: null,
        };

        Constants.USER_BANNED
        const user = await Users.findByPk(submittedUserId);
        const book = await Index.findByPk(submittedIndexId);

        if (!user) {
            result.message = `User ID ${submittedUserId} is not found..`;
            result.status = 404;

            formatLogMsg({
                level: Constants.LEVEL_ERROR,
                serviceName: serviceName,
                fnName: fnName,
                text: result.message
            });

            return result;
        };

        if (!book) {
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

        // if never added wish items, user.wishlist is null, if items all deleted, will be empty []
        if (user.wishlist === null) {
            user.wishlist = [];
        };

        if (user.wishlist.length > 0) {

            // check if book already in wishlist
            const checkAlreadyWished = user.wishlist.find(x => x === submittedIndexId);

            if (checkAlreadyWished !== undefined) {
                result.data = user;
                result.message = `Book ID ${submittedIndexId} is already in your wishlist..`;
                result.status = 400;

                formatLogMsg({
                    level: Constants.LEVEL_ERROR,
                    serviceName: serviceName,
                    fnName: fnName,
                    text: result.message
                });

                return result;
            };
        };

        // console.log("before push", user.wishlist);
        let added = user.wishlist.push(submittedIndexId);
        // console.log("after push", added, user.wishlist);
        try {

            await Users.update(
                { wishlist: user.wishlist },
                { where: { userId: user.userId } }
            );

        } catch (e) {

            console.log('User wishlist save in wishlist service failed: ', e);
            result.message = `Addition to wishlist for User ID ${submittedUserId} failed, please try again later..`;
            result.status = 400;

            formatLogMsg({
                level: Constants.LEVEL_ERROR,
                serviceName: serviceName,
                fnName: fnName,
                text: result.message
            });

            return result;
        };

        result.message = `Book ID ${submittedIndexId} added to wishlist..`;
        result.data = user;
        result.status = 200;

        formatLogMsg({
            level: Constants.LEVEL_INFO,
            serviceName: serviceName,
            fnName: fnName,
            text: result.message
        });

        return result;

    },

    delFrWish: async (submittedUserId, submittedIndexId) => {

        let fnName = fnNameFormat();

        let result = {
            message: null,
            status: null,
            data: null,
        };

        const user = await Users.findByPk(submittedUserId);
        const book = await Index.findByPk(submittedIndexId);

        if (!user) {
            result.message = `User ID ${submittedUserId} is not found..`;
            result.status = 404;

            formatLogMsg({
                level: Constants.LEVEL_ERROR,
                serviceName: serviceName,
                fnName: fnName,
                text: result.message
            });

            return result;
        };

        if (!book) {
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

        // if never added wish items, user.wishlist is null, if items all deleted, will be empty []
        if (user.wishlist === null) {
            user.wishlist = [];
            result.data = user;
            result.message = `There are no items inside User ID ${submittedUserId} wishlist..`;
            result.status = 404;

            formatLogMsg({
                level: Constants.LEVEL_ERROR,
                serviceName: serviceName,
                fnName: fnName,
                text: result.message
            });

            return result;
        };

        if (user.wishlist.length > 0) {

            // check if book in wishlist
            const checkAlreadyWished = user.wishlist.indexOf(submittedIndexId);

            if (checkAlreadyWished === -1) {
                result.data = user;
                result.message = `Book ID ${submittedIndexId} is not in User ID ${submittedUserId} wishlist..`;
                result.status = 400;

                formatLogMsg({
                    level: Constants.LEVEL_ERROR,
                    serviceName: serviceName,
                    fnName: fnName,
                    text: result.message
                });

                return result;
            };

            console.log("before splice", user.wishlist);
            let removed = user.wishlist.splice(checkAlreadyWished, 1);
            console.log("after splice", removed, user.wishlist);

            try {

                await Users.update(
                    { wishlist: user.wishlist },
                    { where: { userId: user.userId } }
                );

            } catch (e) {

                console.log('User wishlist save in wishlist service failed: ', e);
                result.message = `${submittedIndexId} removal from wishlist for User ID ${submittedUserId} failed, please try again later..`;
                result.status = 400;

                formatLogMsg({
                    level: Constants.LEVEL_ERROR,
                    serviceName: serviceName,
                    fnName: fnName,
                    text: result.message
                });

                return result;
            };

            result.message = `Book ID ${submittedIndexId} removed from wishlist of User ID ${submittedUserId}..`;
            result.data = user;
            result.status = 200;

            formatLogMsg({
                level: Constants.LEVEL_INFO,
                serviceName: serviceName,
                fnName: fnName,
                text: result.message
            });

            return result;

        } else {
            result.data = user;
            result.message = `There are no items inside User ID ${submittedUserId} wishlist..`;
            result.status = 404;

            formatLogMsg({
                level: Constants.LEVEL_ERROR,
                serviceName: serviceName,
                fnName: fnName,
                text: result.message
            });

            return result;
        };
    },

    //For user to check his wishlist if books in swap inventory available

    checkMyWishlist: async (submittedUserId) => {

        let fnName = fnNameFormat();

        let result = {
            message: null,
            status: null,
            data: null,
        };

        const user = await Users.findByPk(submittedUserId);

        if (!user) {
            result.message = `User ID ${submittedUserId} is not found..`;
            result.status = 404;

            formatLogMsg({
                level: Constants.LEVEL_ERROR,
                serviceName: serviceName,
                fnName: fnName,
                text: result.message
            });

            return result;
        };

        if (user.wishlist === null) {
            user.wishlist = [];
            result.data = user;
            result.message = `There are no items inside User ID ${submittedUserId} wishlist..`;
            result.status = 200;

            formatLogMsg({
                level: Constants.LEVEL_INFO,
                serviceName: serviceName,
                fnName: fnName,
                text: result.message
            });

            return result;
        };

        if (user.wishlist.length === 0) {
            result.data = user;
            result.message = `There are no items inside User ID ${submittedUserId} wishlist..`;
            result.status = 200;

            formatLogMsg({
                level: Constants.LEVEL_INFO,
                serviceName: serviceName,
                fnName: fnName,
                text: result.message
            });

            return result;
        };

        // check swap inventory based on wishlist        
        const swapRelatedWish = await Swap.findAll({
            where: {
                indexId: user.wishlist,
                // availability: Constants.AVAIL_YES // allow frontend to decide what to show
            },
            include: "Index"
        }); // this format might not be useful.. might need nested array loop to tie to individual indexId

        // console.log(swapRelatedWish, swapRelatedWish.length);

        // if swap items related = 0
        if (swapRelatedWish.length === 0) {
            result.message = `Wishlist related books for purchase is zero..`;
            result.data = swapRelatedWish;
            result.status = 200;

            formatLogMsg({
                level: Constants.LEVEL_INFO,
                serviceName: serviceName,
                fnName: fnName,
                text: result.message
            });

            return result;
        };

        result.message = `Wishlist related books for purchase..`;
        result.data = swapRelatedWish;
        result.status = 200;

        formatLogMsg({
            level: Constants.LEVEL_INFO,
            serviceName: serviceName,
            fnName: fnName,
            text: result.message
        });
        
        return result;
    },

};