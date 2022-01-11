const { Reviews } = require("../connect.js");

module.exports = {
    addReview: async (userId, indexId, rev) => {
        let result = {
            message: null,
            status: null,
            data: null,
        };

        const review = await Reviews.findAll({
            where: {
                indexId: indexId
            }
        })


        if (rev !== review.review) {
            review.review = rev;
        }

        await review.save();
        result.data = review;
        result.status = 200;
        result.message = `review added`;;

        return result;
    },
};