const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
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

exports.onMarkerCreate = markerTrigger.onCreate((doc, context) => {
  return Promise.allSettled([
    updateCount(context.params.mapId, context.eventId, +1),
    notifyMarkerAdded(context.params.mapId, doc.data()),
    lookupAddress(doc),
  ]);
});

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

async function lookupAddress(markerDoc) {
  const marker = markerDoc.data();

  const res = await axios({
    method: "get",
    url: "https://nominatim.openstreetmap.org/reverse",
    headers: {
      "User-Agent": "Notemap - Student project",
    },
    params: {
      format: "jsonv2",
      lat: marker.position._latitude,
      lon: marker.position._longitude,
    },
  });

  if (res.data?.address) {
    const { road, house_number, city, postcode } = res.data.address;

    const address = {};
    if (city) address.city = city;
    if (postcode) address.postcode = postcode;
    if (road) {
      address.street = road;
      if (house_number) {
        address.street += ` ${house_number}`;
      }
    }

    if (Object.keys(address).length) {
      return markerDoc.ref.update({
        address,
      });
    }
  }

  return functions.logger.log(
    `No address found for marker at ${marker.position._latitude}, ${marker.position._longitude}.`
  );
}

async function notifyMarkerAdded(mapId, marker) {
  const mapDoc = await db.doc(`maps/${mapId}`).get();
  const { owner, members = {}, name: mapName } = mapDoc.data();

  if (marker.user === owner.id) {
    return functions.logger.log(
      `No notification sent because marker was placed by map owner.`
    );
  }

  const ownerDoc = await db.doc(`users/${owner.id}`).get();

  const addedBy = members[marker.user]?.name || "Jemand";

  const message = {
    notification: {
      title: "Neuer Marker",
      body: `${addedBy} hat deiner Karte "${mapName}" den Marker ${marker.name} hinzugefügt.`,
    },
    webpush: {
      fcmOptions: {
        link: `map/${mapId}`,
      },
    },
  };

  return sendNotification(message, ownerDoc);
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

exports.addMember = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "you need to be authenticated"
    );
  }
  if (!data.map || !data.email) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "both map and email are required arguments"
    );
  }

  const mapRef = db.doc(`maps/${data.map}`);
  const mapDoc = await mapRef.get();
  const { owner, name: mapName } = mapDoc.data();

  if (context.auth.uid !== owner.id) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "only map owners can add friends"
    );
  }

  const userQuery = await admin
    .firestore()
    .collection("users")
    .where("email", "==", data.email)
    .get();

  if (userQuery.empty) {
    throw new functions.https.HttpsError(
      "not-found",
      "Keine Person mit dieser E-Mail-Adresse gefunden"
    );
  }

  const userDoc = userQuery.docs[0];

  await mapRef.update({
    [`members.${userDoc.id}`]: {
      name: userDoc.data().name,
    },
  });

  const message = {
    notification: {
      title: "Neue Karte",
      body: `${owner.name} hat dich zur Karte "${mapName}" hinzugefügt.`,
    },
    webpush: {
      fcmOptions: {
        link: `map/${mapDoc.id}`,
      },
    },
  };

  return sendNotification(message, userDoc);
});

exports.removeMember = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "you need to be authenticated"
    );
  }
  if (!data.map || !data.userId) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "both map and userId are required arguments"
    );
  }

  const mapRef = db.doc(`maps/${data.map}`);
  const mapDoc = await mapRef.get();

  if (context.auth.uid !== mapDoc.data().owner.id) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "only map owners can remove friends"
    );
  }

  const userDoc = await db.doc(`users/${data.userId}`).get();

  if (!userDoc.exists) {
    throw new functions.https.HttpsError("not-found", "user not found");
  }

  return mapRef.update({
    [`members.${userDoc.id}`]: admin.firestore.FieldValue.delete(),
  });
});

exports.leaveMap = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "you need to be authenticated"
    );
  }
  if (!data.map) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "map is a required argument"
    );
  }

  const userId = context.auth.uid;

  const mapRef = db.doc(`maps/${data.map}`);
  const mapDoc = await mapRef.get();
  const { members = {} } = mapDoc.data();

  if (!(userId in members)) {
    throw new functions.https.HttpsError(
      "not-found",
      "not a member of given map"
    );
  }

  return mapRef.update({
    [`members.${userId}`]: admin.firestore.FieldValue.delete(),
  });
});

async function sendNotification(message, userDoc) {
  const { messagingTokens, name: userName } = userDoc.data();

  if (!messagingTokens.length) {
    return functions.logger.log(
      `There are no notification tokens to send to user ${userName}.`
    );
  }

  functions.logger.log(
    `Sending ${messagingTokens.length} notifications to ${userName}.`
  );

  // Send notifications to all tokens.
  const response = await admin
    .messaging()
    .sendMulticast({ ...message, tokens: messagingTokens });

  // For each message check if there was an error.
  if (response.failureCount > 0) {
    const failedTokens = [];
    response.responses.forEach((resp, idx) => {
      if (!resp.success) {
        failedTokens.push(messagingTokens[idx]);
      }
    });

    if (failedTokens.length > 0) {
      return db.doc(`users/${userDoc.id}`).update({
        messagingTokens: admin.firestore.FieldValue.arrayRemove(failedTokens),
      });
    }
  }
}
