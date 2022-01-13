const { Reviews } = require("../connect.js");

module.exports = {


  addReview: async (userid, indexid, rev) => {

    let result = {
      message: null,
      status: null,
      data: null,
    };

    const review = await Reviews.findOne({
      where: {
        indexId: indexid,
        userId: userid
      }
    });

    if (review === null) {
      //new user and new book => NULL => add review
      const newEntry = await Reviews.create({
        indexId: indexid,
        userId: userid,
        review: rev
      })

      result.data = newEntry;
      result.status = 200;
      result.message = `Review added for book index ${indexid} by user id ${userid}`;
      return result;
    }

    console.log(review);
    if (review && rev === review.review) {
      result.message = `Bad request: Duplicate entry for review`;
      result.status = 400;
      return result;
    }

    if (rev !== review.review) {
      review.review = rev;
    }

    await review.save();
    result.data = review;
    result.status = 200;
    result.message = `Review edited for book index ${indexid} by user id ${userid}`;
    return result;

  }

};

