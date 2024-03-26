const admin = require("firebase-admin");
const Result = require("folktale/result");

module.exports.deleteRoom = async (uid) => {
  return new Promise((resolve) => {
    admin
      .firestore()
      .collection("rooms")
      .where("userIds", "array-contains", uid)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          resolve(Result.Ok("No documents found"));
        } else {
          snapshot.forEach(function (doc) {
            doc.ref
              .delete()
              .then(() => {
                resolve(Result.Ok("Document deleted"));
              })
              .catch((err) => {
                resolve(Result.Error(err));
              });
          });
        }
      })
      .catch((err) => {
        resolve(Result.Error(err));
      });
  });
};
