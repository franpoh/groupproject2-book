const uploadService = require ("../services/uploadBookService");

class UploadController { 
    //POST /protected/uploadbook {userid: 1,  booktitle: "LIMITLESS", bookauthor: "Jim Kwik", bookyear: 2020, bookgenre: 1}
    async uploadbook(req, res, next) {
        
        const loginId = req.userId // token's userId

        console.log('req.userId: ', req.userId );
        console.log("Book Details: ", req.body);

        // console.log('req.body.userid: ', req.body.userid);
        // console.log('req.body.booktitle: ', req.body.booktitle);
        // console.log('req.body.bookauthor: ', req.body.bookauthor);
        // console.log('req.body.bookyear: ', req.body.bookyear);
        // console.log('req.body.bookgenre: ', req.body.bookgenre);
        // console.log('req.body.usercomments: ', req.body.usercomments);

        if (req.userId !== req.body.userid) {
            res.status (400);
            return res.json({
                message: "Incorrect User ID submitted.."
            });
        };

        if (
            typeof req.body.userid !== "number" || typeof req.body.booktitle !== "string" || typeof req.body.bookauthor !== "string"
        ) {
            console.log("typeof userid, " + typeof req.body.userid + " typeof booktitle, " + typeof req.body.booktitle + " typeof bookauthor, " + typeof req.body.bookauthor);
            res.status(400);
            return res.json ({ message: "Incorrect Data Request provided to uploadbook"});
        }

        const result = await uploadService.uploadbook(req.body.userid, req.body.booktitle, req.body.bookauthor, req.body.bookyear, req.body.bookgenre, req.body.usercomments);

        res.status(result.status);

        return res.json({ data: result.data, message: result.message});
    }
}

module.exports = UploadController;