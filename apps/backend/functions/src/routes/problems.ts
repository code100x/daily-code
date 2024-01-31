import { onCall } from "firebase-functions/v2/https";
import { getFirestore } from 'firebase-admin/firestore';

const db = getFirestore();

export const getProblem = onCall(async (request) => {
    const problemId = request.data.problemId;
    const problemDetails = await db.collection("problems").doc(problemId.toString()).get();
    console.log(problemDetails.data())

    return {
        problem: {
            ...problemDetails.data(),
            id: problemDetails.id
        }
    }
});

export const addProblem = onCall(async (request) => {
    const title = request.data.title
    const description = request.data.description
    const type = request.data.type;
    const notionDocId = request.data.notionDocId;
    //Todo : add validation here

    await db.collection("problems").add({
        title,
        description,
        type,
        notionDocId
    });
    return true;
});