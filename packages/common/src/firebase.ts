import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";

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
export const auth = getAuth(app);
// export const functions = getFunctions(app, "http://127.0.0.1:5001");
export const functions = getFunctions(app);

export const getFunction = (name: string) => {
  // const fn = httpsCallable(functions, `leetcode-clone-c39eb/us-central1/${name}`)
  const fn = httpsCallable(functions, name);
  return fn;
};
export { onAuthStateChanged } from "firebase/auth";
