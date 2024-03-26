const admin = require("firebase-admin");
const Result = require("folktale/result");

module.exports.deleteUser = async (uid) => {
  return new Promise((resolve) => {
    admin
      .firestore()
      .collection("users")
      .doc(uid)
      .delete()
      .then((snapshot) => {
        if (snapshot.empty) {
          resolve(Result.Ok("No documents found"));
        } else {
          resolve(Result.Ok("User successfully deleted"));
        }
      })
      .catch((err) => {
        resolve(Result.Error(err));
      });
  });
};
