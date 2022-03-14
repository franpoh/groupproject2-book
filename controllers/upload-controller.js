const uploadService = require("../services/upload-book-service");
const Constants = require("../constants/index");

const { formatLogMsg, fileNameFormat, controllerFnNameFormat }= require("../services/service-logger/log-format");

const serviceName = fileNameFormat( __filename, __dirname );

class UploadController {
    //POST /protected/uploadbook {"userid": 8, "booktitle": "Test Book Title 13", "bookauthor": "Test Book Author", "bookyear": 2007, "bookgenre": 1, "usercomments": "Test Comments Duplicate Copy of Book" }
    async uploadbook(req, res, next) {
        console.log('req.userId: ', req.userId);
        console.log("Book Details: ", req.body);

        let fnName = controllerFnNameFormat();

        // check for required data 
        if (!req.userId || !req.body.userid|| !req.body.booktitle || !req.body.bookauthor || req.body.booktitle === "" || req.body.bookauthor === "") {
            res.status(400);

            let message = 'Incomplete data types submitted..'; // need this for error formatLogMsg

            formatLogMsg({
                level: Constants.LEVEL_ERROR,
                serviceName: serviceName,
                fnName: fnName,
                text: message
            });

            return res.json({
                message: message
            });
        };

        const loginId = req.userId;
        const submittedUserId = parseInt(req.body.userid);
        const submittedTitle = req.body.booktitle;
        const submittedAuthor = req.body.bookauthor;
        let submittedBookYear;
        let submittedBookGenre;
        let submittedUserComments;
        let submittedBookCover;

        // check for correct type for required data 
        if (typeof submittedUserId !== "number" || typeof submittedTitle !== "string" || typeof submittedAuthor !== "string" || !Number.isFinite(submittedUserId)) {
            // console.log("typeof userid, " + typeof submittedUserId + " typeof booktitle, " + typeof submittedTitle + " typeof bookauthor, " + typeof submittedAuthor);
            res.status(400);

            let message = 'Incorrect data types submitted..'; // need this for error formatLogMsg

            formatLogMsg({
                level: Constants.LEVEL_ERROR,
                serviceName: serviceName,
                fnName: fnName,
                text: message
            });

            return res.json({
                message: message
            });
        };

        // check for author and title length limit
        if (submittedTitle.length === 0 || submittedTitle.length > 100 || submittedAuthor.length === 0 || submittedAuthor.length > 100) {            
            res.status(400);

            let message = 'Invalid data types submitted..'; // need this for error formatLogMsg

            formatLogMsg({
                level: Constants.LEVEL_ERROR,
                serviceName: serviceName,
                fnName: fnName,
                text: message
            });

            return res.json({
                message: message
            });
        };

        // check for token id match with body id
        if (loginId !== submittedUserId) {
            res.status(400);

            let message = `Incorrect User ID ${submittedUserId}/Token ${loginId} received. Please re-login.`; // need this for error formatLogMsg

            formatLogMsg({
                level: Constants.LEVEL_ERROR,
                serviceName: serviceName,
                fnName: fnName,
                text: message
            });

            return res.json({
                message: message
            });
        };

        // check for bookyear
        if (!req.body.bookyear || req.body.bookyear === "") {
            submittedBookYear = null; // year to service should not be undefined, as default when empty in DB should be null
        } else if ((req.body.bookyear).toString().length !== 4 && !Number.isFinite(parseInt(req.body.bookyear))) { // What if it's a REALLY old book at year 500 AD?
            res.status(400);

            let message = `Book year ${req.body.bookyear} is invald. Please provide a valid year.`; // need this for error formatLogMsg

            formatLogMsg({
                level: Constants.LEVEL_ERROR,
                serviceName: serviceName,
                fnName: fnName,
                text: message
            });

            return res.json({
                message: message
            });
        } else {
            submittedBookYear =  parseInt(req.body.bookyear);
        };

        // check for genreId
        if (!req.body.bookgenre){
            submittedBookGenre = null; // genre to service should not be undefined, as default when empty in DB should be null
        } else if (typeof parseInt(req.body.bookgenre) !== "number" || !Number.isFinite(parseInt(req.body.bookgenre))) {
            res.status(400);

            let message = `Book genre ${req.body.bookgenre} is invald.`; // need this for error formatLogMsg

            formatLogMsg({
                level: Constants.LEVEL_ERROR,
                serviceName: serviceName,
                fnName: fnName,
                text: message
            });

            return res.json({
                message: message
            });
        } else {
            submittedBookGenre = parseInt(req.body.bookgenre);
        };
        
        // check for user comments
        if (!req.body.usercomments || req.body.usercomments === ""){
            submittedUserComments = null; // user comments to service should not be undefined, as default when empty in DB should be null
        } else if ((req.body.usercomments).toString() <= 5) {
            res.status(400);

            let message = `User Comments is too short. Please leave a comment longer than 5 characters.`; // need this for error formatLogMsg

            formatLogMsg({
                level: Constants.LEVEL_ERROR,
                serviceName: serviceName,
                fnName: fnName,
                text: message
            });

            return res.json({
                message: message
            });
        } else {
            submittedUserComments = (req.body.usercomments).toString();
        };

        // check for bookcover
        function isImage(url) {
            return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
        };

        if (!req.body.bookcover) {
            submittedBookCover= null; // image url to service should not be undefined, as default when empty in DB should be null
        } else if (req.body.bookcover==="" || !(isImage(req.body.bookcover))) {
            res.status(400);

            let message = `URL provided by user is not an image. Please provide a valid image URL.`; // need this for error formatLogMsg

            formatLogMsg({
                level: Constants.LEVEL_ERROR,
                serviceName: serviceName,
                fnName: fnName,
                text: message
            });

            return res.json({
                message: message
            });
        } else {
            submittedBookCover = req.body.bookcover;
        };

        const result = await uploadService.uploadbook(submittedUserId, submittedTitle, submittedAuthor, submittedBookYear, submittedBookGenre, submittedUserComments, submittedBookCover);
        res.status(result.status);

        formatLogMsg({
            level: (result.status == 200 ? Constants.LEVEL_INFO : Constants.LEVEL_ERROR),
            serviceName: serviceName,
            fnName: fnName,
            text: result.message // info only
        });

        return res.json({
            data: result.data, message: result.message
        });
    };
};

module.exports = UploadController;