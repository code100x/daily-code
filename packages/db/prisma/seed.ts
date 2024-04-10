import db from "../src";
import seedsData from "./seedsData";

async function main() {
  const hashID: any[] = [];
  const promises: Promise<any>[] = [];
  seedsData.forEach((seed) => {
    hashID.push(seed.data.id);
    if (!hashID.includes(seed.data.id)) {
      const promise = db.track.create(seed);
      promises.push(promise);
    }
  });
  await Promise.all(promises);
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
