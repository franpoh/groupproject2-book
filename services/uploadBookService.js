const res = require("express/lib/response");
const { Index, Swap } = require("../connect.js");

module.exports = {
    uploadbook: async (userid, booktitle, bookauthor, bookgenre) => {
        let result = {
            message: null,
            status: null,
            data: null,
        };

        if (!userid || !booktitle || !bookauthor ){
            result.message = "Incomplete Request Parameters.";
            result.status = 404;
            return result;
        }

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
                indexId: library.dataValues.indexId 
                });

            result.data = newSwap;
            result.status = 200;
            result.message = "Book successfully uploaded for swap!";
            return result;
        }   

        console.log("*****library*****", library);
        const addToSwap = await Swap.create({ userId: userid, price: 1, indexId: library.dataValues.indexId });
        console.log(`Swap Request Created: `, addToSwap instanceof Swap);
        result.data = library;
        result.status = 200;
        result.message = "Book successfully uploaded for swap!";
        return result;
    },
}