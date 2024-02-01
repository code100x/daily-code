import { onCall } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";
import { getLastSolvedForUser } from "../handlers/tracks";

const db = getFirestore();

export const getTracks = onCall(async (request) => {
  const tracksCollection = await db.collection("tracks").get();
  const allTracks = [];

  tracksCollection.docs.forEach((t) => {
    if (t.data()?.visible) {
      allTracks.push({
        id: t.id,
        title: t.data().title,
        image: t.data().image,
        description: t.data().description,
        problems: t.data().problems.map((x) => x.id),
      });
    }
  });

  return {
    tracks: await Promise.all(allTracks),
  };
});

export const getTrack = onCall(async (request) => {
  const trackId = request.data.trackId;
  const uid = request.auth?.uid;

  const track = await db.collection("tracks").doc(trackId).get();

  return {
    track: {
      id: track.id,
      title: track.data().title,
      image: track.data().image,
      description: track.data().description,
      problems: track.data().problems.map((x) => x.id),
    },
    userProgress: await getLastSolvedForUser(trackId, uid),
  };
});

export const getLastSolved = onCall(async (request) => {
  const uid = request.auth?.uid;
  const trackId = request.data.trackId;
  return getLastSolvedForUser(trackId, uid);
});
