const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.userSignup = functions.auth.user().onCreate((user) => {
  return admin.firestore().collection("users").doc(user.uid).set(
    {
      email: user.email,
    },
    { merge: true }
  );
});

exports.userDeleted = functions.auth.user().onDelete((user) => {
  const doc = admin.firestore().collection("users").doc(user.uid);
  return doc.delete();
});

exports.addUserDisplayName = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "you need to be authenticated"
    );
  }
  return Promise.all([
    admin.firestore().collection("users").doc(context.auth.uid).set(
      {
        name: data.displayName,
      },
      { merge: true }
    ),
    admin.auth().updateUser(context.auth.uid, {
      displayName: data.displayName,
    }),
  ]);
});
