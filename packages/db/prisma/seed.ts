import db from "../src";

async function main() {
  const track = await db.track.create({
    data: {
      title: "Track 1",
      description: "Track 1 description",
      image: "https://ideogram.ai/api/images/direct/8WZ67gBuQ8upuCvVHTWU4g.jpg",
      problems: {
        create: {
          problem: {
            create: {
              title: "Problem 1",
              description: "Problem 1 description",
              notionDocId: "Step-11-Initialize-balances-on-signup-b2a919bd555a47579d848144e8190553",
              type: "Blog",
            },
          },
          sortingOrder: 1,
        },
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
