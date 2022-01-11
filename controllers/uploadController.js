const uploadService = require ("../services/uploadBookService");

class BookController { 
    //POST /protected/uploadbook {userid: 1,  booktitle: "LIMITLESS", bookauthor: "Jim Kwik", bookyear: 2020, bookgenre: 1}
    async uploadbook(req, res, next) {
        console.log("Book Details: ", req.body);
        
        if (
            typeof req.body.userId !== "number" || typeof req.body.title !== "string" || typeof req.body.author !== "string"
        ) {
            console.log("typeof userId, " + typeof req.body.userId + "typeof title, " + typeof req.body.title + "typeof author, " + typeof req.body.author);
            res.status(400);
            return res.json ({ message: "Incorrect Data Request provided to uploadbook"});
        }

        const result = await uploadService.uploadbook(req.body.userId, req.body.title, req.body.author, req.body.genreId);
        // const result = await swapService.uploadbook(req.body.userid, req.body.booktitle, req.body.bookauthor, req.body.bookyear, req.body.bookgenre);

        res.status(result.status);

        return res.json({ data: result.data, message: result.message});
    }
}

module.exports = BookController;