const admin = require("firebase-admin");
const Result = require("folktale/result");

module.exports.isUserExist = async (mobile) => {
  return new Promise((resolve) => {
    admin
      .auth()
      .getUserByEmail(mobile)
      .then((response) => {
        resolve(Result.Ok(response));
      })
      .catch((err) => {
        if (err.code === "auth/user-not-found") {
          resolve(Result.Ok(null));
        } else {
          resolve(Result.Error(err));
        }
      });
  });
};
