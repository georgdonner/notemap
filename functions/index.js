const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

exports.userSignup = functions.auth.user().onCreate((user) => {
  return db.collection("users").doc(user.uid).set(
    {
      email: user.email,
    },
    { merge: true }
  );
});

exports.userDeleted = functions.auth.user().onDelete((user) => {
  const doc = db.collection("users").doc(user.uid);
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
    db.collection("users").doc(context.auth.uid).set(
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

const markerTrigger = functions.firestore.document(
  "maps/{mapId}/markers/{markerId}"
);

exports.onMarkerCreate = markerTrigger.onCreate((doc, context) =>
  updateCount(context.params.mapId, context.eventId, +1)
);

exports.onMarkerDelete = markerTrigger.onDelete((doc, context) =>
  updateCount(context.params.mapId, context.eventId, -1)
);

async function updateCount(mapId, eventId, delta) {
  try {
    await db
      .doc(`events/${eventId}`)
      .create({ createdAt: admin.firestore.FieldValue.serverTimestamp() });

    await db
      .doc(`maps/${mapId}`)
      .update(
        { markerCount: admin.firestore.FieldValue.increment(delta) },
        { merge: true }
      );
  } catch (error) {
    if (error.code === "ALREADY_EXISTS") {
      functions.logger.debug("Duplicated event trigger!");
    } else {
      throw error;
    }
  }
}

exports.scheduledFunction = functions.pubsub
  .schedule("every 24 hours")
  .onRun(() => {
    return cleanupEvents();
  });

async function cleanupEvents() {
  // Only clean up those older than 10 minutes
  const limitDate = new Date(Date.now() - 1000 * 60 * 10);

  const batch = db.batch();

  const pastEvents = await db
    .collection("events")
    .orderBy("createdAt", "asc")
    .where("createdAt", "<", limitDate)
    .limit(400)
    .get();

  pastEvents.forEach((event) => batch.delete(event.ref));

  await batch.commit();
}
