import db from "../src";
import seedsData from "./seedsData";

async function main() {
  const hashID: any[] = [];
  const promises: Promise<any>[] = [];

  for (const seed of seedsData) {
    const existingTrack = await db.track.findUnique({
      where: { id: seed.data.id },
    });

    if (!existingTrack) {
      const promise = db.track.create({ data: seed.data });
      promises.push(promise);
      hashID.push(seed.data.id);
    } else {
      console.log(`Track with id ${seed.data.id} already exists.`);
    }
  }

  await Promise.all(promises);


  // --------------------database table data --------------------------

  // codelanguageData table data initialisation
  const codeLanguageData = [
    { id: 63, label: "Javascript", value: "javascript" },
    { id: 54, label: "C++", value: "cpp" },
  ];
  const idArray: number[] = [];
  const labelsArray: string[] = [];
  const valuesArray: string[] = [];

  // problemStatement table data init
  const commonData = {
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
  };

// categoriesData table data init
  const categoriesData = [
    { id: "web-development", category: "Web Development" },
    { id: "adv-web-development", category: "Advance Web Development" },
    { id: "dsa", category: "Data Structures and Algorithms" },
    { id: "devops", category: "Devops" },
    { id: "projects", category: "Projects" },
    { id: "extras", category: "Extras" },
  ];
  const idsArray: string[] = [];
  const categoriesArray: string[] = [];

// trackCategoryData table data init
  const trackCategoryData = [
    { trackId: "6SbPPXGkG8QKFOTW9BmL", categoryId: "web-development" },
    { trackId: "ABEC", categoryId: "adv-web-development" },
    { trackId: "Auth", categoryId: "web-development" },
    { trackId: "CI-CD", categoryId: "devops" },
    { trackId: "Next-Auth", categoryId: "adv-web-development" },
    { trackId: "PayTM2", categoryId: "projects" },
    { trackId: "Paytm", categoryId: "projects" },
    { trackId: "Redis", categoryId: "adv-web-development" },
    { trackId: "YOSAherHkqWXhOdlE4yE", categoryId: "adv-web-development" },
    { trackId: "ZSQI8YNE0iL6sT1hJpts", categoryId: "projects" },
    { trackId: "blog", categoryId: "projects" },
    { trackId: "docker-2", categoryId: "devops" },
    { trackId: "docker-easy", categoryId: "devops" },
    { trackId: "dsa", categoryId: "dsa" },
    { trackId: "dsa2", categoryId: "dsa" },
    { trackId: "eooSv7lnuwBO6wl9YA5w", categoryId: "adv-web-development" },
    { trackId: "g0AcDSPl74nk45ZZjRdU", categoryId: "adv-web-development" },
    { trackId: "gZf9uBBNSbBR7UCqyyqT", categoryId: "adv-web-development" },
    { trackId: "monorepo", categoryId: "adv-web-development" },
    { trackId: "mw", categoryId: "web-development" },
    { trackId: "nextjs-1", categoryId: "adv-web-development" },
    { trackId: "nextjs-2", categoryId: "adv-web-development" },
    { trackId: "oAjvkeRNZThPMxZf4aX5", categoryId: "projects" },
    { trackId: "rendering", categoryId: "adv-web-development" },
    { trackId: "senior", categoryId: "extras" },
    { trackId: "ts-hard", categoryId: "adv-web-development" },
    { trackId: "w5E6PT2t0IyOFM3bZxcM", categoryId: "adv-web-development" },
  ];
  const trackIdsArray: string[] = [];
  const categoryIdsArray: string[] = [];

// --------------------database table data end --------------------------

// --------------------------------------------------------------------------

// --------------------database table data upsert  --------------------------

  for (const data of codeLanguageData) {
    await db.codeLanguage.upsert({
      where: { id: data.id },
      update: data,
      create: data
    })
  }
 
  await db.problemStatement.upsert({
    where: { id: "1" },
    update: { ...commonData },
    create: { ...commonData }
  });


  for (const data of categoriesData) {
    await db.categories.upsert({
      where: { id: data.id },
      update: data,
      create: data
    });
  };

 

  for (const data of trackCategoryData) {
    await db.trackCategory.upsert({
      where: {
        trackId_categoryId: {
          trackId: data.trackId,
          categoryId: data.categoryId
        }
      },
      update: data,
      create: data
    })
  }
}

// --------------------database table data upsert end --------------------------

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
