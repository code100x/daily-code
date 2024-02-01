import { onCall } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";

const db = getFirestore();

export const getUserDetails = onCall(async (request) => {
  const uid = request.auth.uid;
  const userCollection = await db.collection("users").doc(uid.toString()).get();

  if (userCollection && userCollection.data && userCollection.data().admin) {
    return {
      admin: true,
    };
  }

  return {
    admin: false,
  };
});
