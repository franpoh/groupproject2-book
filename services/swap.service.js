const { Swap, Users } = require("../connect.js");

module.exports = {

    // G1 query: middleware verification of token here or in controller?
    swapBook: async (submittedUserId, submittedSwapId) => {

        let result = {
            message: null,
            status: null,
            data: null,
        };

        const user = await Users.findByPk(submittedUserId);
        const book = await Swap.findByPk(submittedSwapId);

        // in rare case that submitted id is not the login id, also need to match id in token here?
        if (!user) {
            result.message = `User ID ${submittedUserId} is not found..`;
            result.status = 404;
            return result;
        };

        // in case submitted book does not exist in inventory OR book has just been bought by another concurrent user
        if (!book) {
            result.message = `Book ID ${submittedSwapId} is not found or no longer available..`;
            result.status = 404;
            return result;
        };

        // price of book = book.price
        // user available credits = user.points
        if (user.points <= 0) {
            // in case any book price somehow is zero
            result.message = `User ID ${submittedUserId} currently does not have valid points..`;
            result.status = 400;
            return result;
        };

        if (book.price > user.points) {
            // in case book price beyond user credits
            result.message = `User ID ${submittedUserId} currently does not have enough points to take book ID ${submittedSwapId}..`;
            result.status = 400;
            return result;
        };

        // G1 100122: currently once buy, book is gone from swap inventory, all related comments or bought by whom info gone. GTH to keep as SOLD status/sales history? 
        // Assumed auto deliver to buyer, and auto deduct of user credits

        // user.points = user.points - book.price;

        try {

            const transactionAttempt = await user.save();
            // User credit MUST be deducted successfully before proceeding to remove book from swap inventory

            console.log(transactionAttempt);

            if (transactionAttempt == true) {
                // proceed with removal of book from swap inventory
            };

        } catch(e) {

            // credit deduction unsuccessful
            console.log('User point save in swap service failed: ', e);
            result.message = `Points deduction for User ID ${submittedUserId} failed, please try again later..`;
            result.status = 400;
            return result;

        };
        
        


    }

};