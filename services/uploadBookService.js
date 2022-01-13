const { Index, Swap, Users } = require("../connect.js");

module.exports = {

    uploadbook: async (userid, booktitle, bookauthor, bookyear, bookgenre, usercomments) => {

        let result = {
            message: null,
            status: null,
            data: null,
        };

        const user = await Users.findOne({
            where: {userId: userid}
        });

        if(!user) {
            result.message = `User ID ${userid} is not found. Please register an account before uploading a book for swap!`;
            result.status = 404;
            return result;
        } console.log("User Attempting to upload book for swap, user is: ", user);

        //If necessary parameters are given, findorcreate index.
        
        const [library, created] = await Index.findOrCreate({
            where: { 
                title: booktitle,
                author: bookauthor
         },
         defaults: {
             title: booktitle,
             author: bookauthor,
             genreId: bookgenre,
             year: bookyear
         }
        });

        // If index was created, add it to swap, give userId point.
        if (created) {

            console.log(`User ${userid} requested to add book titled ${booktitle}, by author ${bookauthor} to library but it does not exist. Adding to index database...`);

            try {

                library.title = booktitle;
                library.author = bookauthor;
                library.genreId = bookgenre;
                library.year = bookyear;
                const newIndex = await library.save();
                console.log("New Index Request Created: ", newIndex instanceof Index);
                console.log("Book details successfully added to index database.");
                console.log("New Index added to Library, index id:", library.dataValues.indexId);

            } catch (error) {

                console.log('User attempted to access library, failed. Error: ', error);
                result.message = "Failed to access library database. Please try again later.";
                result.status = 500;
                return result;

            }
            
            const addToSwap = await Swap.create({
                userId: userid,
                price: 1, 
                indexId: library.dataValues.indexId,
                availability: "YES",
                comments: usercomments
                });
            
            console.log(`Swap Request Created: `, addToSwap instanceof Swap);
            console.log('New Swap ID: ', addToSwap.dataValues.swapId);

            //if swap id for new swap is created, give points.
            if (addToSwap.dataValues.swapId !== null) {

                try {

                    console.log("User current points is ", user.dataValues.points);
                    console.log("Swap price/point is ", addToSwap.dataValues.price);
    
                    const currentPoints = user.dataValues.points
                    const currentPrice = addToSwap.dataValues.price
                    const expectedPoints = currentPoints + currentPrice;
    
                    user.dataValues.points += addToSwap.dataValues.price;
    
                    console.log("New User Points should be: ", user.dataValues.points);
                    const newPoints = user.dataValues.points;
    
                    await Users.update ({
                        points: newPoints }, 
                        { where: { userId: userid }
                    }); 
                    // await user.save()
                    console.log("New User Points is now: ", user.dataValues.points);
    
                    if (user.dataValues.points !== expectedPoints) {
                    result.message = "System failed to save new points, please contact an administrator or send us an email."
                    result.status = 500;
                    }
    
                    console.log(`${addToSwap.dataValues.price} points successfully added to user ${userid}`);

                    result.data = addToSwap;
                    result.status = 200;
                    result.message = "Book successfully uploaded for swap! You currently have " + user.dataValues.points + " points";
                    return result;

                } catch (error) {
                    
                    console.log('User attempted to upload book to swap, failed. Error: ', error);
                    result.message = `Failed to add ${addToSwap.dataValues.price} points to your account. Please contact our administrator through email.`
                    result.status = 500;
                    return result;

                }

            }

           
        }   

        console.log("Book currently exists in index library", library);
        console.log("Adding book swap request to swap");

        const addToSwap = await Swap.create({
            userId: userid,
            price: 1, 
            indexId: library.dataValues.indexId,
            availability: "YES",
            comments: usercomments
        });
        console.log(`Swap Request Created: `, addToSwap instanceof Swap);
        console.log('New Swap ID: ', addToSwap.dataValues.swapId);

        //if swap id for new swap is created, give points.
        if (addToSwap.dataValues.swapId !== null) {

         try {
        
            console.log("User current points is ", user.dataValues.points);
            console.log("Swap price/point is ", addToSwap.dataValues.price);
        
            const currentPoints = user.dataValues.points
            const currentPrice = addToSwap.dataValues.price
            const expectedPoints = currentPoints + currentPrice;
            
            user.dataValues.points += addToSwap.dataValues.price;
            
            console.log("New User Points should be: ", user.dataValues.points);
            const newPoints = user.dataValues.points;
            
            await Users.update ({
                points: newPoints }, 
                { where: { userId: userid }
            }); 
            // await user.save()
            console.log("New User Points is now: ", user.dataValues.points);
            
            if (user.dataValues.points !== expectedPoints) {
            result.message = "System failed to save new points, please contact an administrator or send us an email."
            result.status = 500;
            }
            
            console.log(`${addToSwap.dataValues.price} points successfully added to user ${userid}`);
        
            result.data = addToSwap;
            result.status = 200;
            result.message = "Book successfully uploaded for swap! You currently have " + user.dataValues.points + " points";
            return result;
        
        } catch (error) {
                            
            console.log('User attempted to upload book to swap, failed. Error: ', error);
            result.message = `Failed to add ${addToSwap.dataValues.price} points to your account. Please contact our administrator through email.`
            result.status = 500;
            return result;
        
        }
    }
    },
}