const { Reviews } = require("../connect.js");

module.exports = {

  addReview: async (userid, indexid, rev) => {

    let result = {
      message: null,
      status: null,
      data: null,
    };

    const review = await Reviews.findAll();
    const [newReview, created] = await Reviews.findOrCreate({
      where: {
        review: rev,
        userId: userid,
        indexId: indexid
      },
      defaults: { // applied if not found
        review: rev,
        userId: userid,
        indexId: indexid
      }
      // review: rev,
      // userId: userid,
      // indexId: indexid
    })

    if (rev === newReview.review) {
      result.message = `${rev} is a duplicate. Unable to perfrom request`;
      result.status = 400;
      return result;
    }

    if (userid === newReview.userId && indexid === newReview.indexId) {
      result.message = `Review entry for book ID ${newReview.indexId} already exists from user ID ${newReview.userId}`;
      result.status = 400;
      return result;
    }

    if (created) {
      newReview.review = rev
      newReview.userId = userid
      newReview.indexId = indexid
      result.data = newReview;
      result.status = 200;
      result.message = `....`;;
      return result;
    }

    result.data = newReview;
    result.status = 200;
    result.message = `review added`;;

    return result;
  },
};

/*
[
  [
    {
      "reviewId": 1,
      "review": "Lots of suspense and mystery, a fascinating read.",
      "userId": 1,
      "indexId": 2,
      "createdAt": null,
      "updatedAt": null
    },
    {
      "reviewId": 2,
      "review": "I am looking forward to the sequel!",
      "userId": 2,
      "indexId": 1,
      "createdAt": null,
      "updatedAt": null
    }
  ]
]

{
"rev":"NO SEQUELS NEEDEDED!",
"userId":2,
"indexId":1
}

*/

// FK reviews_id in index or swap database?

    // if (rev !== review.review) {
    //     review.review = rev;
    // }
    //         const review = await Reviews.findAll({
    //             where: {
    //                 indexId: indexId
    //             }
    //         })
    //         if (rev !== review.review) {
    //             review.review = rev;
    //         }

    //         await review.save();
    //         result.data = review;
    // await newReview.save();