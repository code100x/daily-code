import { getFirestore } from "firebase-admin/firestore";

const db = getFirestore();

export const getLastSolvedForUser = async (trackId: string, uid: string) => {
  const track = await db.collection("tracks").doc(trackId.toString()).get();
  const problemIds = track.data().problems.map((x) => x.id);

  if (!uid) {
    return {
      nextProblemId: problemIds[0],
      lastProblemId: problemIds[0],
    };
  }

  const lastSolvedProblem = await db.collection("trackProgress").doc(`${uid}-${trackId}`).get();
  if (lastSolvedProblem.exists) {
    const lastProblemId = lastSolvedProblem.data().problemId;
    const lastProblemIdIndex = problemIds.findIndex((x) => x == lastProblemId);
    const nextProblemIdIndex =
      lastProblemIdIndex == problemIds.length - 1 ? lastProblemIdIndex : lastProblemIdIndex + 1;
    const nextProblemId = problemIds[nextProblemIdIndex];
    return {
      nextProblemId,
      lastProblemId,
    };
  }

  return {
    nextProblemId: problemIds[0],
    lastProblemId: null,
  };
};
