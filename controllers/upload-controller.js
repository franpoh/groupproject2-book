const uploadService = require("../services/upload-book-service");

class UploadController {
    //POST /protected/uploadbook {"userid": 8, "booktitle": "Test Book Title 13", "bookauthor": "Test Book Author", "bookyear": 2007, "bookgenre": 1, "usercomments": "Test Comments Duplicate Copy of Book" }
    async uploadbook(req, res, next) {
        console.log('req.userId: ', req.userId);
        console.log("Book Details: ", req.body);

        const loginId = req.userId;

        if (req.userId !== req.body.userid) {
            res.status(400);
            return res.json({
                message: "uploadController: Incorrect User ID/Token received. Please re-login."
            });
        };

        if (!req.body.userid || !req.body.booktitle || !req.body.bookauthor) {
            res.status(400);
            return res.json({
                message: "uploadController: Incomplete Data Request provided to uploadbook."
            });
        };

        if (
            typeof req.body.userid !== "number" || typeof req.body.booktitle !== "string" || typeof req.body.bookauthor !== "string"
        ) {
            console.log("typeof userid, " + typeof req.body.userid + " typeof booktitle, " + typeof req.body.booktitle + " typeof bookauthor, " + typeof req.body.bookauthor);
            res.status(400);
            return res.json({
                message: "Incorrect Data Request provided to uploadbook"
            });
        };

        //unnecessary as front-end should have a dropdown to show genres available, but just in case.
        if (req.body.bookgenre && (typeof req.body.bookgenre !== "string")) {
            res.status(400);
            return res.json({ message: "Genre does not exist." });
        };

        if (req.body.bookyear && req.body.bookyear.length < 4) {
            res.status(400);
            return res.json({ message: "Book year is invald. Please provide a valid year." });
        };

        if (req.body.usercomments && req.body.usercomments.length <= 5) {
            res.status(400);
            return res.json({ message: "User Comments is too short. Please leave a comment longer than 5 characters." });
        };

        // function isImage(url) {
        //     return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
        // };

        // if (req.body.bookcover=="") {
        //     res.status(400);
        //     return res.json({ message: "URL provided by user is not an image. Please provide a valid image URL."})
        // };
        console.log(result);
        const result = await uploadService.uploadbook(req.body.userid, req.body.booktitle, req.body.bookauthor, req.body.bookyear, req.body.bookgenre, req.body.usercomments);
        console.log(result);
        res.status(result.status);

        return res.json({
            data: result.data, message: result.message
        });
    };
};

module.exports = UploadController;