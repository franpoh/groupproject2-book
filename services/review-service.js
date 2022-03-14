const { Reviews, Index } = require("../connect.js");

const Constants = require("../constants/index.js");

const { formatLogMsg, fileNameFormat, fnNameFormat } = require("./service-logger/log-format");

const serviceName = fileNameFormat(__filename, __dirname);

module.exports = {

  addReview: async (userid, indexid, rev) => {

    let fnName = fnNameFormat();

    let result = {
      message: null,
      status: null,
      data: null,
    };

    const index = await Index.findOne({
      where: {
        indexId: indexid
      }
    });

    if (index === null) {
      result.message = `Bad request: Book ID "${indexid}" does not exist in the database`;
      result.status = 400;

      formatLogMsg({
        level: Constants.LEVEL_ERROR,
        serviceName: serviceName,
        fnName: fnName,
        text: result.message
      });

      return result;
    }

    if (!index || index === null) {
      result.message = `Bad request: this Book ID "${indexid}" does not exist in the database`;
      result.status = 400;

      formatLogMsg({
        level: Constants.LEVEL_ERROR,
        serviceName: serviceName,
        fnName: fnName,
        text: result.message
      });

      return result;
    }

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

      formatLogMsg({
        level: Constants.LEVEL_INFO,
        serviceName: serviceName,
        fnName: fnName,
        text: result.message
      });

      return result;
    }

    // console.log(review);
    if (review && rev === review.review) {
      result.message = `Bad request: Duplicate entry for review`;
      result.status = 400;

      formatLogMsg({
        level: Constants.LEVEL_ERROR,
        serviceName: serviceName,
        fnName: fnName,
        text: result.message
      });

      return result;
    }

    if (rev !== review.review) {
      review.review = rev;
    }

    await review.save();
    result.data = review;
    result.status = 200;
    result.message = `Review edited for book index ${indexid} by user id ${userid}`;

    formatLogMsg({
      level: Constants.LEVEL_INFO,
      serviceName: serviceName,
      fnName: fnName,
      text: result.message
    });

    return result;

  }

};

