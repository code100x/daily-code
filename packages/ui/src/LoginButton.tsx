"use client";
import { Button } from "./shad/ui/button";
import { signIn, signOut } from "next-auth/react";

const LoginButton = ({ user }) => {
  return (
    <div>
      {!user ? (
        <Button
          variant={"outline"}
          onClick={async () => {
            await signIn();
          }}
        >
          Login
        </Button>
      ) : (
        ""
      )}
      {user ? (
        <Button
          variant={"outline"}
          onClick={async () => {
            await signOut();
          }}
        >
          Logout
        </Button>
      ) : (
        ""
      )}
    </div>
  );
};

export default LoginButton;
