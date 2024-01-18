"use client";

import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { auth, onAuthStateChanged } from "@repo/common";
import { userAtom } from "@repo/store";

export const Auth = () => {
    const setUser = useSetRecoilState(userAtom)
    useEffect(() => {
      onAuthStateChanged(auth, function (user) {
        if (user && user.email) {
          setUser({
            email: user.email,
            name: user.displayName || ""
          });
        } else {
          setUser(null);
          // No user is signed in.
          console.log("There is no logged in user");
        }
      });
    }, []);
  
    return null
}