const { Swap, Users } = require("../connect.js");
const Constants = require("../constants/index.js");

const { formatLogMsg, fileNameFormat, fnNameFormat }= require("./service-logger/log-format");

const serviceName = fileNameFormat( __filename, __dirname );


module.exports = {

    grabBook: async (submittedUserId, submittedSwapId) => {

        let fnName = fnNameFormat();

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

            formatLogMsg({
                level: Constants.LEVEL_ERROR,
                serviceName: serviceName,
                fnName: fnName,
                text: result.message
            });

            return result;
        };

        // in case submitted book does not exist in inventory OR book has just been bought by another concurrent user
        if (!book || book.availability === Constants.AVAIL_NO) {
            result.message = `Book ID ${submittedSwapId} is not found or no longer available..`;
            result.status = 404;

            formatLogMsg({
                level: Constants.LEVEL_ERROR,
                serviceName: serviceName,
                fnName: fnName,
                text: result.message
            });

            return result;
        };

        // price of book = book.price
        if (book.price <= 0 || book.price === null || book.price === undefined) {
            // in case book price somehow is zero or lower
            result.message = `Book ID ${submittedSwapId} currently is not available for purchase..`;
            result.status = 400;

            formatLogMsg({
                level: Constants.LEVEL_ERROR,
                serviceName: serviceName,
                fnName: fnName,
                text: result.message
            });

            return result;
        };

        // user available credits = user.points
        if (user.points <= 0 || user.points === null || user.points === undefined) {
            // in case user credit somehow is zero or lower
            result.message = `User ID ${submittedUserId} currently does not have valid points..`;
            result.status = 400;

            formatLogMsg({
                level: Constants.LEVEL_ERROR,
                serviceName: serviceName,
                fnName: fnName,
                text: result.message
            });

            return result;
        };

        if (book.price > user.points) {
            // in case book price beyond user credits
            result.message = `User ID ${submittedUserId} currently does not have enough points to take book ID ${submittedSwapId}..`;
            result.status = 400;

            formatLogMsg({
                level: Constants.LEVEL_ERROR,
                serviceName: serviceName,
                fnName: fnName,
                text: result.message
            });

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
                { where: { userId: user.userId } }
            );

            // console.log('updating user');
            // User credit MUST be deducted successfully before proceeding to "remove" book from swap availability

            // result not for return but for log update
            result.message = `User ID ${user.userId} points updated to ${user.points}..`;            
            result.status = 200;
            
            formatLogMsg({
                level: Constants.LEVEL_INFO,
                serviceName: serviceName,
                fnName: fnName,
                text: result.message
            });

        } catch (e) {

            // credit deduction unsuccessful
            console.log('User point save in swap service failed: ', e);
            result.message = `Points deduction for User ID ${submittedUserId} failed, please try again later..`;
            result.status = 400;

            formatLogMsg({
                level: Constants.LEVEL_ERROR,
                serviceName: serviceName,
                fnName: fnName,
                text: result.message
            });

            return result;

        };

        console.log('transaction with swap inventory after user save');

        // attempt to change target book availability in swap inventory
        try {

            book.availability = Constants.AVAIL_NO;
            book.purchasedId = submittedUserId;

            // await book.save();
            // switch to update in case

            await Swap.update(
                {
                    availability: book.availability,
                    purchasedId: book.purchasedId
                },
                { where: { swapId: book.swapId } }
            );

            console.log('book no longer available: ', book.availability);

            // result not for return but for log update
            result.message = `User ID ${book.purchasedId} purchased Book Swap ID ${book.swapId}, availability set to ${book.availability}..`;            
            result.status = 200;
            
            formatLogMsg({
                level: Constants.LEVEL_INFO,
                serviceName: serviceName,
                fnName: fnName,
                text: result.message
            });

        } catch (e) {
            // when NO fails, to restore user credit, problem here, if book removal fails and somehow restore credit also fails, user loses credit for nothing, need simultaneous transaction GTH but sequelize does not have real simultaneous transactions. Ref: https://sequelize.org/master/manual/transactions.html

            user.points = user.points + book.price;
            // await user.save();
            // switch to update in case

            await Users.update(
                { points: user.points },
                { where: { userId: user.userId } }
            );

            // result not for return but for log update
            result.message = `User ID ${user.userId} points restored to ${user.points} due error in  purchase Book Swap ID ${book.swapId}..`;
            result.status = 200;
            
            formatLogMsg({
                level: Constants.LEVEL_INFO,
                serviceName: serviceName,
                fnName: fnName,
                text: result.message
            });
            
            // for return to client for failure of grab
            result.data = user;
            result.message = `Transaction not complete, please try again..`;
            result.status = 400;

            formatLogMsg({
                level: Constants.LEVEL_ERROR,
                serviceName: serviceName,
                fnName: fnName,
                text: result.message
            });

            return result;

        };

        result.message = `Transaction complete..`;
        result.data = user;
        result.status = 200;
        
        formatLogMsg({
            level: Constants.LEVEL_INFO,
            serviceName: serviceName,
            fnName: fnName,
            text: result.message
        });

        return result;

    }
};