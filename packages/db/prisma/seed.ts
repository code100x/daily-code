import db from "../src";
import seedsData from "./seedsData";

async function main() {
  const hashID: string[] = [];
  for (const seed of seedsData) {
    if (!hashID.includes(seed.data.id)) {
      try {
        const alreadyExists = await db.track.findUnique({
          where:{
            id:seed.data.id
          }
        })
        if(!alreadyExists){
          const track = await db.track.create({
            data: seed.data,
          });
        }
        hashID.push(seed.data.id);
      } catch (error) {
        console.log(error);
      }
    }
  }

  await db.categories.create({
    data: {
      id: "web-development",
      category: "Web Development",
    },
  });

  await db.categories.create({
    data: {
      id: "adv-web-development",
      category: "Advance Web Development",
    },
  });

  await db.categories.create({
    data: {
      id: "dsa",
      category: "Data Structures and Algorithms",
    },
  });

  await db.categories.create({
    data: {
      id: "devops",
      category: "Devops",
    },
  });

  await db.categories.create({
    data: {
      id: "projects",
      category: "Projects",
    },
  });

  await db.categories.create({
    data: {
      id: "extras",
      category: "Extras",
    },
  });

  await db.trackCategory.createMany({
    data: [
      {
        trackId: "6SbPPXGkG8QKFOTW9BmL",
        categoryId: "web-development",
      },
      {
        trackId: "ABEC",
        categoryId: "adv-web-development",
      },
      {
        trackId: "Auth",
        categoryId: "web-development",
      },
      {
        trackId: "CI-CD",
        categoryId: "devops",
      },
      {
        trackId: "Next-Auth",
        categoryId: "adv-web-development",
      },
      {
        trackId: "PayTM2",
        categoryId: "projects",
      },
      {
        trackId: "Paytm",
        categoryId: "projects",
      },
      {
        trackId: "Redis",
        categoryId: "adv-web-development",
      },
      {
        trackId: "YOSAherHkqWXhOdlE4yE",
        categoryId: "adv-web-development",
      },
      {
        trackId: "ZSQI8YNE0iL6sT1hJpts",
        categoryId: "projects",
      },
      {
        trackId: "blog",
        categoryId: "projects",
      },
      {
        trackId: "docker-2",
        categoryId: "devops",
      },
      {
        trackId: "docker-easy",
        categoryId: "devops",
      },
      {
        trackId: "dsa",
        categoryId: "dsa",
      },
      {
        trackId: "dsa2",
        categoryId: "dsa",
      },
      {
        trackId: "eooSv7lnuwBO6wl9YA5w",
        categoryId: "adv-web-development",
      },
      {
        trackId: "g0AcDSPl74nk45ZZjRdU",
        categoryId: "adv-web-development",
      },
      {
        trackId: "gZf9uBBNSbBR7UCqyyqT",
        categoryId: "adv-web-development",
      },
      {
        trackId: "monorepo",
        categoryId: "adv-web-development",
      },
      {
        trackId: "mw",
        categoryId: "web-development",
      },
      {
        trackId: "nextjs-1",
        categoryId: "adv-web-development",
      },
      {
        trackId: "nextjs-2",
        categoryId: "adv-web-development",
      },
      {
        trackId: "oAjvkeRNZThPMxZf4aX5",
        categoryId: "projects",
      },
      {
        trackId: "rendering",
        categoryId: "adv-web-development",
      },
      {
        trackId: "senior",
        categoryId: "extras",
      },
      {
        trackId: "ts-hard",
        categoryId: "adv-web-development",
      },
      {
        trackId: "w5E6PT2t0IyOFM3bZxcM",
        categoryId: "adv-web-development",
      },
    ],
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
