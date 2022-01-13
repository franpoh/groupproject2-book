const { Swap, Users } = require("../connect.js");

module.exports = {

    grabBook: async (submittedUserId, submittedSwapId) => {

        let result = {
            message: null,
            status: null,
            data: null,
        };

        const user = await Users.findByPk(submittedUserId);
        const book = await Swap.findByPk(submittedSwapId);

        if (!user) {
            result.message = `User ID ${submittedUserId} is not found..`;
            result.status = 404;
            return result;
        };

        // in case submitted book does not exist in inventory OR book has just been bought by another concurrent user
        if (!book || book.availability === "NO") {
            result.message = `Book ID ${submittedSwapId} is not found or no longer available..`;
            result.status = 404;
            return result;
        };

        // price of book = book.price
        // user available credits = user.points
        if (user.points <= 0 || user.points === null || user.points === undefined) {
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
        // G1 110122: now availability, not destroy.
        // Assumed auto deliver to buyer, and auto deduct of user credits

        user.points = user.points - book.price;

        try {

            // await user.save();
            // switch to update in case

            await Users.update(
                { points: user.points },
                { where: { userId: user.userId }}
            );

            console.log('updating user');
            // User credit MUST be deducted successfully before proceeding to "remove" book from swap availability

        } catch(e) {

            // credit deduction unsuccessful
            console.log('User point save in swap service failed: ', e);
            result.message = `Points deduction for User ID ${submittedUserId} failed, please try again later..`;
            result.status = 400;
            return result;

        };
        
        console.log('transaction with swap inventory after user save');

        // attempt to change target book availability in swap inventory
        try {

            book.availability = "NO";

            // await book.save();
            // switch to update in case

            await Swap.update(
                { availability: book.availability },
                { where: { swapId: book.swapId }}
            );
    
            console.log('book no longer available: ', book);

        } catch(e) {
            // when NO fails, to restore user credit, problem here, if book removal fails and somehow restore credit also fails, user loses credit for nothing, need simultaneous transaction GTH but sequelize does not have real simultaneous transactions. Ref: https://sequelize.org/master/manual/transactions.html
            
            user.points = user.points + book.price;
            // await user.save();
            // switch to update in case

            await Users.update(
                { points: user.points },
                { where: { userId: user.userId }}
            );

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