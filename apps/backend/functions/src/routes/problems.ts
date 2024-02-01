import { onCall } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";

const db = getFirestore();

export const getProblem = onCall(async (request) => {
  const problemId = request.data.problemId;
  const problemDetails = await db.collection("problems").doc(problemId.toString()).get();
  console.log(problemDetails.data());

  return {
    problem: {
      ...problemDetails.data(),
      id: problemDetails.id,
    },
  };
});

export const editProblem = onCall(async (request) => {
  const problemId = request.data.problemId;
  const updateTitle = request.data.title;
  const updateDescription = request.data.description;
  const updateType = request.data.type;
  const updateNotionDocId = request.data.notionDocId;

  await db.collection("problems").doc(problemId.toString()).update({
    title: updateTitle,
    description: updateDescription,
    type: updateType,
    notionDocId: updateNotionDocId,
  });

  return {
    updated: true,
  };
});

export const addProblem = onCall(async (request) => {
  const title = request.data.title;
  const description = request.data.description;
  const type = request.data.type;
  const notionDocId = request.data.notionDocId;
  //Todo : add validation here

  await db.collection("problems").add({
    title,
    description,
    type,
    notionDocId,
  });
  return true;
});

export const allProblem = onCall(async () => {
  const problemsCollection = await db.collection("problems").get();

  const allProblems = [];

  problemsCollection.docs.forEach((doc) => {
    allProblems.push({
      id: doc.id,
      description: doc.data().title,
      type: doc.data().type,
      notionDocId: doc.data().notionDocId,
    });
  });

  return {
    problems: allProblems,
  };
});
