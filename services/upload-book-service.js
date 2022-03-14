const { Index, Swap, Users } = require("../connect.js");
const Constants = require("../constants/index.js");

const { formatLogMsg, fileNameFormat, fnNameFormat }= require("./service-logger/log-format");

const serviceName = fileNameFormat( __filename, __dirname );

const priceOfBook = 1; // currently client side not uploading price data.

let obtainedId; // var for assigned IndexId

module.exports = {

    uploadbook: async (userid, booktitle, bookauthor, bookyear, bookgenre, usercomments, bookcover) => {

        let fnName = fnNameFormat();

        let result = {
            message: null,
            status: null,
            data: null,
        };

        const user = await Users.findOne({
            where: { userId: userid }
        });

        if (!user) {
            result.message = `User ID ${userid} is not found. Please register an account before uploading a book for swap!`;
            result.status = 404;

            formatLogMsg({
                level: Constants.LEVEL_ERROR,
                serviceName: serviceName,
                fnName: fnName,
                text: result.message
            });

            return result;
        }

        result.message = `User Attempting to upload book for swap, user id: ${user.userId} `, 

        formatLogMsg({
            level: Constants.LEVEL_INFO,
            serviceName: serviceName,
            fnName: fnName,
            text: result.message
        });

        //If necessary parameters are given, findorcreate index.
        try {

            const [library, created] = await Index.findOrCreate({
                where: {
                    title: booktitle,
                    author: bookauthor
                },
                defaults: {
                    title: booktitle,
                    author: bookauthor,
                    genreId: bookgenre,
                    // year: bookyear,
                    // imageURL: bookcover
                }
            });

            obtainedId = library.indexId;
    
            // If index was created, add it to swap, give userId point.
            if (created) {
    
                result.message = `User ${userid} requested to add book to library but it does not exist. Adding to index database...`
    
                formatLogMsg({
                    level: Constants.LEVEL_INFO,
                    serviceName: serviceName,
                    fnName: fnName,
                    text: result.message
                });
    
                try {
    
                    library.title = booktitle;
                    library.author = bookauthor;
                    if (bookgenre !== null) {library.genreId = bookgenre};
                    if (bookyear !== null) {library.year = bookyear};
                    if (bookcover !== null) {library.imageURL = bookcover};                
                    const newIndex = await library.save();

                    obtainedId = newIndex.dataValues.indexId;
    
                    result.status = 200;
                    result.message = `New Index added to Library, index id: ${newIndex.dataValues.indexId}, title: ${newIndex.dataValues.title} by ${newIndex.dataValues.author}`
    
                    formatLogMsg({
                        level: Constants.LEVEL_INFO,
                        serviceName: serviceName,
                        fnName: fnName,
                        text: result.message
                    });
    
                } catch (error) {
    
                    result.message = `Failed to access library database. Error: ${error} Please try again later.`;
                    result.status = 500;
    
                    formatLogMsg({
                        level: Constants.LEVEL_ERROR,
                        serviceName: serviceName,
                        fnName: fnName,
                        text: result.message
                    });
    
                    return result;
                };
            };

        } catch(error) {

            result.message = `Failed to create new index in database. Error: ${error} Please try again later.`;
            result.status = 500;

            formatLogMsg({
                level: Constants.LEVEL_ERROR,
                serviceName: serviceName,
                fnName: fnName,
                text: result.message
            });

            return result;
        };        
            
        try {
            const addToSwap = await Swap.create({
                userId: userid,
                price: priceOfBook,
                indexId: obtainedId,
                availability: Constants.AVAIL_YES,
                comments: usercomments
            });

            result.status = 200;
            result.message = `New Swap Created, Swap ID: ${addToSwap.dataValues.swapId}`

            formatLogMsg({
                level: Constants.LEVEL_INFO,
                serviceName: serviceName,
                fnName: fnName,
                text: result.message
            });

        } catch (e) {
            result.message = `User ID ${user.userId} attempted to upload a new swap, failed. Error: ${e}`;
            result.status = 500;

            formatLogMsg({
                level: Constants.LEVEL_ERROR,
                serviceName: serviceName,
                fnName: fnName,
                text: result.message
            });

            return result;
        };
            
        //swap id for new swap is created, give points.
        try {

            // console.log("User current points is ", user.dataValues.points);
            // console.log("Swap price/point is ", addToSwap.dataValues.price);

            const currentPoints = user.dataValues.points;
            const currentPrice = priceOfBook;
            const expectedPoints = currentPoints + currentPrice;

            user.dataValues.points += priceOfBook;

            // console.log("New User Points should be: ", user.dataValues.points);
            const newPoints = user.dataValues.points;

            await Users.update({
                points: newPoints
            },
                {
                    where: { userId: userid }
                });

            // console.log("New User Points is now: ", user.dataValues.points);

            if (user.dataValues.points !== expectedPoints) {
                result.message = "System failed to save new points, please contact an administrator or send us an email."
                result.status = 500;

                formatLogMsg({
                    level: Constants.LEVEL_ERROR,
                    serviceName: serviceName,
                    fnName: fnName,
                    text: result.message
                });

                return result;
            }

            console.log(`${priceOfBook} points successfully added to user ${userid}`);

            result.data = user;
            result.status = 200;
            result.message = "Book successfully uploaded for swap! You currently have " + user.dataValues.points + " points";

            formatLogMsg({
                level: Constants.LEVEL_INFO,
                serviceName: serviceName,
                fnName: fnName,
                text: result.message
            });

            return result;

        } catch (error) {

            console.log('User attempted to upload book to swap, failed. Error: ', error);
            result.message = `Failed to add ${priceOfBook} points to your account. Please contact our administrator through email.`
            result.status = 500;

            formatLogMsg({
                level: Constants.LEVEL_ERROR,
                serviceName: serviceName,
                fnName: fnName,
                text: result.message
            });

            return result;
        };
        

        // try {
        //     const addToSwap = await Swap.create({
        //         userId: userid,
        //         price: priceOfBook,
        //         indexId: library.dataValues.indexId,
        //         availability: Constants.AVAIL_YES,
        //         comments: usercomments
        //     });
            
        //     result.status = 200;
        //     result.message = `New Swap Created, ID: ${addToSwap.dataValues.swapId}`;

        //     //if swap id for new swap is created, give points.
        //     if (addToSwap.dataValues.swapId !== null) {

        //         try {

        //             // console.log("User current points is ", user.dataValues.points);
        //             // console.log("Swap price/point is ", addToSwap.dataValues.price);

        //             const currentPoints = user.dataValues.points;
        //             const currentPrice = priceOfBook;
        //             const expectedPoints = currentPoints + currentPrice;

        //             user.dataValues.points += addToSwap.dataValues.price;

        //             // console.log("New User Points should be: ", user.dataValues.points);
        //             const newPoints = user.dataValues.points;

        //             await Users.update({
        //                 points: newPoints
        //             },
        //                 {
        //                     where: { userId: userid }
        //                 });
                    
        //             console.log("New User Points is now: ", user.dataValues.points);

        //             if (user.dataValues.points !== expectedPoints) {
        //                 result.message = "System failed to save new points, please contact an administrator or send us an email."
        //                 result.status = 500;

        //                 formatLogMsg({
        //                     level: Constants.LEVEL_ERROR,
        //                     serviceName: serviceName,
        //                     fnName: fnName,
        //                     text: result.message
        //                 });

        //                 return result;
        //             }

        //             result.data = addToSwap;
        //             result.status = 200;
        //             result.message = `Book successfully uploaded for swap! User ID ${user.userId} currently has ${user.dataValues.points} points`;

        //             formatLogMsg({
        //                 level: Constants.LEVEL_INFO,
        //                 serviceName: serviceName,
        //                 fnName: fnName,
        //                 text: result.message
        //             });

        //             return result;

        //         } catch (error) {

        //             result.message = `Failed to add ${addToSwap.dataValues.price} points to ${user.userId}'s account. Please contact our administrator through email.`
        //             result.status = 500;

        //             formatLogMsg({
        //                 level: Constants.LEVEL_ERROR,
        //                 serviceName: serviceName,
        //                 fnName: fnName,
        //                 text: result.message
        //             });
                    
        //             return result;

        //         }
        //     }
        // } catch (error) {

        // };
    },
}