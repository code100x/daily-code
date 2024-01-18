import { onCall } from "firebase-functions/v2/https";
import { getFirestore } from 'firebase-admin/firestore';

const db = getFirestore();

export const getTracks = onCall(async (request) => {
    const tracksCollection = await db.collection("tracks").get();
    const allTracks = [];

    tracksCollection.docs.forEach(t => {
        allTracks.push({
                id: t.id,
                title: t.data().title,
                image: t.data().image,
                description: t.data().description,
                problems: t.data().problems.map(x => x.id)
            }
        )
    })

    return {
        tracks: await Promise.all(allTracks)
    }
})


export const getLastSolved = onCall(async (request) => {
    const uid = request.auth?.uid;
    const trackId = request.data.trackId;
    
    const track = await db.collection("tracks").doc(trackId.toString()).get();
    const problemIds = track.data().problems.map(x => x.id);

    if (!uid) {
        return {
            nextProblemId: problemIds[0],
            lastProblemId: problemIds[0]
        }
    }

    const lastSolvedProblem = await db.collection("trackProgress").doc(`${uid}-${trackId}`).get();
    if (lastSolvedProblem.exists) {
        const lastProblemId = lastSolvedProblem.data().problemId;
        const lastProblemIdIndex = problemIds.findIndex(x => x == lastProblemId);
        const nextProblemIdIndex = (lastProblemIdIndex == problemIds.length - 1) ? lastProblemIdIndex : lastProblemIdIndex + 1;
        const nextProblemId = problemIds[nextProblemIdIndex];
        return {
            nextProblemId,
            lastProblemId
        }
    }

    return {
        nextProblemId: problemIds[0],
        lastProblemId: null,
    }
})
