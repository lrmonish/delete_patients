const admin = require("firebase-admin");
const Result = require("folktale/result");

module.exports.deleteAuthUser = async (uid) => {
  return new Promise((resolve) => {
    admin
      .auth()
      .deleteUser(uid)
      .then((response) => {
        resolve(Result.Ok("Auth User Deleted", response));
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
