const res = require("express/lib/response");
const { Index, Swap, Users } = require("../connect.js");

module.exports = {
    uploadbook: async (username, booktitle, bookauthor, bookgenre, usercomments) => {
        let result = {
            message: null,
            status: null,
            data: null,
        };

        if (!username || !booktitle || !bookauthor ){
            result.message = "Incomplete Request Parameters.";
            result.status = 404;
            return result;
        }

        const findUserId = await Users.findOne({
            where: { username: username}
        });

        if (findUserId===null) {
            result.message = (`User ID for ${username} not found.`);
            result.status = 404;
            return result;
            }
        // console.log(findUserId instanceof Users);
        // console.log(findUserId);
        const userid = findUserId.dataValues.userId;
        console.log("userid---------------", findUserId.userid);

        const [library, created] = await Index.findOrCreate({
            where: { 
                title: booktitle,
                author: bookauthor,
                genreId: bookgenre
         },
         defaults: {
             title: booktitle,
             author: bookauthor,
             genreId: bookgenre
         }

        });

        if (created) {

            console.log(`User ${userid} requested to add book titled ${booktitle}, by author ${bookauthor} to library but it does not exist. Adding to index database...`);
            library.title = booktitle;
            library.author = bookauthor;
            library.genre = bookgenre;
            const newIndex = await library.save();
            console.log("newIndex" + newIndex);
            console.log("Book details successfully added to index database.");
            console.log(library.dataValues.indexId);

            const newSwap = await Swap.create({
                userId: userid,
                price: 1, 
                indexId: library.dataValues.indexId,
                availability: "YES",
                comments: usercomments
                });

            result.data = newSwap;
            result.status = 200;
            result.message = "Book successfully uploaded for swap!";
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
        result.data = addToSwap;
        result.status = 200;
        result.message = "Book successfully uploaded for swap!";
        return result;
    },
}