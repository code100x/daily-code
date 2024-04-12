import db from "../src";
import seedsData from "./seedsData";

async function main() {
  const hashID: any[] = [];
  const promises: Promise<any>[] = [];
  seedsData.forEach((seed) => {
    if (!hashID.includes(seed.data.id)) {
      const promise = db.track.create(seed);
      promises.push(promise);
    }
    hashID.push(seed.data.id);
  });
  await Promise.all(promises);
  await db.codeLanguage.createMany({
    data: [
      {
        id: 63,
        label: "Javascript",
        value: "javascript",
      },
      {
        id: 54,
        label: "C++",
        value: "cpp",
      },
    ],
  });
  await db.problemStatement.create({
    data: {
      id: "1",
      problemId: "ts-11",
      mainFuncName: "twoSum",
      argumentNames: ["nums", "target"],
      testCases: {
        create: [
          {
            expectedOutput: "[ 0, 1 ]",

            inputs: ["[2, 7, 11, 15]", "9"],
          },

          {
            expectedOutput: "[ 1, 2 ]",
            inputs: ["[3, 2, 4, 6]", "6"],
          },
        ],
      },
      languagesSupported: {
        connect: [{ id: 54 }, { id: 63 }],
      },
    },
  });
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
