import { setGlobalOptions } from "firebase-functions/v2";

import { onRequest, onCall } from "firebase-functions/v2/https";

import * as logger from "firebase-functions/logger";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { SUPPORTED_LANGUAGES } from "./utils";
initializeApp();

const db = getFirestore();

setGlobalOptions({ maxInstances: 10 });

export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

export const getSubmissions = onRequest({ cors: true }, async (request, response) => {
  // const offset = request.body.offset;
  const limit = request.body.limit || 10;
  const res = await db.collection("submissions").limit(limit).orderBy("submitTime", "desc").get();
  const submissions = [];
  console.log("res.docs");
  console.log(res.docs.length);
  res.docs.forEach(async (doc) => {
    console.log("doc1");
    submissions.push(
      new Promise(async (resolve) => {
        console.log(doc.data().user);
        const snapshot = await doc.data().user.get();
        resolve({
          submission: doc.data(),
          user: snapshot.data(),
        });
      })
    );
  });

  response.send({
    response: await Promise.all(submissions),
  });
});

export const submit = onCall(async (request) => {
  const uid = request.auth.uid;
  const language = request.data.language;
  const submission = request.data.submission;
  const problemId = request.data.problemId;

  if (!uid) {
    return {
      message: "Unauthorized",
    };
  }

  if (!SUPPORTED_LANGUAGES.includes(language)) {
    return {
      message: "Language not supported",
    };
  }

  const problem = await db.collection("problems").doc(problemId?.toString()).get();

  if (!problem.exists) {
    return {
      message: "Problem Doesnt exist",
    };
  }

  const doc = await db.collection("submissions").add({
    language,
    submission,
    problemId,
    userId: uid,
    submitTime: new Date(),
    workerTryCount: 0,
    status: "PENDING",
  });

  return {
    message: "Submission done",
    id: doc.id,
  };
});

export * from "./routes/tracks";
export * from "./routes/problems";
export * from "./routes/user";
