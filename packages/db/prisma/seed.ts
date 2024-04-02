import db from "../src";

const seedData = [
  {
    title: "Typescript",
    description:
      "Learn about strongly typed languages, Typescript and how you can integrate it into your existing javascript codebase.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/2048px-Typescript_logo_2020.svg.png",
    problems: {
      create: [
        {
          problem: {
            create: {
              description: "The tsc compiler",
              title: "The tsc compiler",
              type: "Blog",
              notionDocId: "c537d8ae0dc9424fba168f04d024b797",
            },
          },
        },
        {
          problem: {
            create: {
              description: "What is Typescript",
              title: "What is Typescript",
              type: "Blog",
              notionDocId: "3843927cfd3c44a6b0e6107a66bd10a3",
            },
          },
        },
        {
          problem: {
            create: {
              description: "Types of Languages",
              title: "Types of Languages",
              type: "Blog",
              notionDocId: "Step-1-Types-of-languages-24f2476c2b9c4c97a51bfef919dd39e6",
            },
          },
        },
      ],
    },
  },
  {
    title: "Authentication",
    description: "How to implement authentication in your website.",
    image: "https://ideogram.ai/api/images/direct/C_U7Xo9YQiib6JjbreU2VQ.png",
    problems: {
      create: [
        {
          problem: {
            create: {
              description: "Authentication using cookies (Part 1)",
              title: "Authentication using cookies (Part 1)",
              type: "Blog",
              notionDocId: "Authentication-using-cookies-Part-1-5b2bc62899f34720ad888df4873c966e",
            },
          },
        },
        {
          problem: {
            create: {
              description: "Authentication using jwt + localstorage",
              title: "Authentication using jwt + localstorage",
              type: "Blog",
              notionDocId: "Authentication-using-jwt-localstorage-8a6be0a741074bf2b79cc610126a1a96",
            },
          },
        },
        {
          problem: {
            create: {
              description: "What is authentication?",
              title: "What is authentication?",
              type: "Blog",
              notionDocId: "What-is-authentication-e8fb0241878349d2bd0a6115d8ca1071",
            },
          },
        },
      ],
    },
  },
];

async function main() {
  seedData.forEach(async (track: any) => {
    await db.track.create({
      data: track,
    });
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
