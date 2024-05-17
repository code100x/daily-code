"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";

const Signin = () => {
    const session = useSession();
    const router = useRouter();
  
    const redirected = useRef(false);
    useEffect(() => {
      if (redirected.current === false && session.data?.user) {
        const redirectUrl = localStorage.getItem("loginRedirectUrl");
        localStorage.removeItem("loginRedirectUrl");
        router.replace(redirectUrl || "/");
        redirected.current = true;
      }
    }, [redirected, session, router]);
  return (
    <div className="flex justify-center items-center min-h-screen relative">
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url('https://img.freepik.com/premium-vector/abstract-dark-background-zeros-ad-ones-shades-gray-colors_444390-3371.jpg?size=626&ext=jpg&ga=GA1.1.553209589.1713916800&semt=ais')`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-80"></div>
      </div>
      <div className="z-10 max-w-md w-full mx-auto rounded-2xl md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black border-8 border-solid border-neutral-700/2 ">
        <h2 className="font-bold text-2xl text-neutral-800 dark:text-neutral-200 text-center bg-[#7dd3fc1a] rounded-lg py-2">
          Welcome to Daily Code By{" "}
          <span className="text-[#38bdf8]">100xDevs</span>
        </h2>
        <p className="text-neutral-600 text-m max-w-sm mt-2 dark:text-neutral-300 text-center">
          Login to DailyCode to access exclusive content and features.
        </p>
        <div className="grid grid-cols-3 gap-4">
            {[...Array(9)].map((_, index) => (
              <div key={index} className="opacity-50">
                <i className="fas fa-arrow-down fa-3x"></i>
              </div>
            ))}
          </div>
        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-2 h-[1px] w-full" />

        <div className="flex flex-col space-y-4 button">
         

          <button
            className="relative group/btn flex space-x-2 items-center justify-center px-4 w-full text-black rounded-md h-14 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)] hover:border border-grey-200/2 transition-border transition-delay-500 duration-300"
            type="button"
            onClick={async () => {
                await signIn("google");
              }}
          >
            <IconBrandGoogle className="h-8 w-8 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-m">
              Continue With Google
            </span>
            <BottomGradient />
          </button>

             <button
            className="relative group/btn flex space-x-2 items-center justify-center px-4 w-full text-black rounded-md h-14 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)] hover:border border-grey-200/2 transition-border transition-delay-500 duration-300"
            type="button"
            onClick={async () => {
                await signIn("github");
              }}
          >
            <IconBrandGithub className="h-8 w-8 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-m">
              Continue With GitHub
            </span>
            <BottomGradient />
          </button>
            
          <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300 text-center">
            By signing in, you agree to our{" "}
            <a href="https://app.100xdevs.com/tnc">
              <u>Terms & Conditions</u>
            </a>{" "}
            &{" "}
            <a href="https://app.100xdevs.com/privacy-policy">
              <u>Privacy Policy</u>
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

export default Signin;
