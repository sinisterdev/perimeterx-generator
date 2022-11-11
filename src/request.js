const requestlibcurl = require("request-libcurl");

const request = (opts) => {
  return new Promise((resolve, reject) => {
    requestlibcurl(opts, (error, resp) => {
      if (error) {
        reject(error);
      } else {
        resolve(resp);
      }
    });
  });
};
module.exports = request;
