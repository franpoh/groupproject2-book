const { Swap, Users } = require("../connect.js");

module.exports = {

    // G1 query: middleware verification of token here or in controller?
    grabBook: async (submittedUserId, submittedSwapId) => {

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

    /* temp due price of books

        if (book.price > user.points) {
            // in case book price beyond user credits
            result.message = `User ID ${submittedUserId} currently does not have enough points to take book ID ${submittedSwapId}..`;
            result.status = 400;
            return result;
        };
    */

        // G1 100122: currently once buy, book is gone from swap inventory, all related comments or bought by whom info gone. GTH to keep as SOLD status/sales history? 
        // Assumed auto deliver to buyer, and auto deduct of user credits


    /* temp due price of books and limit on edit user credits
        user.points = user.points - book.price;
    */

        try {

            await user.save();

            console.log('saving user');
            // User credit MUST be deducted successfully before proceeding to remove book from swap inventory

        } catch(e) {

            // credit deduction unsuccessful
            console.log('User point save in swap service failed: ', e);
            result.message = `Points deduction for User ID ${submittedUserId} failed, please try again later..`;
            result.status = 400;
            return result;

        };
        
        console.log('transaction with swap inventor after user save');

        // attempt to remove target book from swap inventory
        try {
    
    /* temp due book removal from swap table
            await book.destroy();
    */
            console.log('destroying book');

        } catch(e) {
            // when removal fails, to restore user credit, problem here, if book removal fails and somehow restore credit also fails, user loses credit for nothing, need simultaneous transaction GTH
            user.points = user.points + book.price;
            await user.save();
            result.data = user;
            result.message = `Transaction not complete, please try again..`;
            result.status = 400;
            return result;

        };
        
        result.message = `Transaction complete..`;
        result.data = user;
        result.status = 200;
        return result;

    }

};