import { initializeApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";
import db from "../src";

export const firebaseConfig = {
  apiKey: "AIzaSyAjjsbl9eSDWSmfrWpFPap2uGuwONZ2N4g",
  authDomain: "leetcode-clone-c39eb.firebaseapp.com",
  projectId: "leetcode-clone-c39eb",
  storageBucket: "leetcode-clone-c39eb.appspot.com",
  messagingSenderId: "66814187798",
  appId: "1:66814187798:web:a6b3702e191448722dd837",
  measurementId: "G-ET5FNB5WCN",
};

export const app = initializeApp(firebaseConfig);
// export const functions = getFunctions(app, "http://127.0.0.1:5001");
export const functions = getFunctions(app);

export const getFunction = (name: string) => {
  // const fn = httpsCallable(functions, `leetcode-clone-c39eb/us-central1/${name}`)
  const fn = httpsCallable(functions, name);
  return fn;
};

async function getTracks() {
  const getTracksFn = getFunction("getTracks");
  try {
    const tracks: any = await getTracksFn();
    return tracks.data.tracks || [];
  } catch (e) {
    return [];
  }
}

async function getProblem(problemId: string) {
  const getProblem = getFunction("getProblem");
  const response: any = await getProblem({ problemId });
  const { description, title, type, notionDocId, id } = response.data.problem;
  return { description, title, type: type.charAt(0).toUpperCase() + type.slice(1), notionDocId, id };
}

const main = async () => {
  const allTracks: any = await getTracks();

  for (const track of allTracks) {
    const { title, description, image, id } = track;
    const problemForTracks = await Promise.all(
      track.problems.map(async (problem: any) => {
        return await getProblem(problem);
      })
    );
    const reversedProblems: any = problemForTracks.reverse();

    let ctr = 1;
    reversedProblems.forEach((problem: any) => {
      if (!problem.title) {
        problem.title = problem.description;
      }
      if (!problem.description) {
        problem.description = problem.title;
      }
      problem.sortingOrder = ctr++;
    });

    await db.track.create({
      data: {
        id,
        title,
        description,
        image,
        problems: {
          create: reversedProblems.map((problem: any) => {
            return { problem: { create: problem } };
          }),
        },
      },
    });
  }
};

main();
