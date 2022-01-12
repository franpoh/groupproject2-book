const { Index, Users } = require("../connect.js");

module.exports = {

    addToWish: async (submittedUserId, submittedIndexId) => {

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
            return result;
        };

        if (!book) {
            result.message = `Book ID ${submittedIndexId} is not found..`;
            result.status = 404;
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
                return result;
            };
        };

        console.log("before push", user.wishlist);
        let added = user.wishlist.push(submittedIndexId);
        console.log("after push", added, user.wishlist);
        try {

            await Users.update(
                { wishlist: user.wishlist},
                { where: { userId: user.userId  }}
            );

        } catch(e) {

            console.log('User wishlist save in wishlist service failed: ', e);
            result.message = `Addition to wishlist for User ID ${submittedUserId} failed, please try again later..`;
            result.status = 400;
            return result;
        };

        result.message = `Book added to wishlist..`;
        result.data = user;
        result.status = 200;
        return result;

    },

    delFrWish: async (submittedUserId, submittedIndexId) => {

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
            return result;
        };

        if (!book) {
            result.message = `Book ID ${submittedIndexId} is not found..`;
            result.status = 404;
            return result;
        };

        // if never added wish items, user.wishlist is null, if items all deleted, will be empty []
        if (user.wishlist === null) {
            user.wishlist = [];
            result.data = user;
            result.message = `There are no items inside your wishlist..`;
            result.status = 404;
            return result;
        };

        if (user.wishlist.length > 0) {

            // check if book in wishlist
            const checkAlreadyWished = user.wishlist.indexOf(submittedIndexId);

            if (checkAlreadyWished === -1) {
                result.data = user;
                result.message = `Book ID ${submittedIndexId} is not in your wishlist..`;
                result.status = 400;
                return result;
            };

            console.log("before splice", user.wishlist);
            let removed = user.wishlist.splice(checkAlreadyWished, 1);
            console.log("after splice", removed, user.wishlist);

            try {

                await Users.update(
                    { wishlist: user.wishlist},
                    { where: { userId: user.userId  }}
                );
                
            } catch(e) {
    
                console.log('User wishlist save in wishlist service failed: ', e);
                result.message = `Removal from wishlist for User ID ${submittedUserId} failed, please try again later..`;
                result.status = 400;
                return result;
            };
    
            result.message = `Book removed from wishlist..`;
            result.data = user;
            result.status = 200;
            return result;

        };

        result.message = `Unknown error`;
        result.status = 400;
        return result;
    }

};