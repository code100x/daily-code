"use client";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button, Separator } from "@repo/ui";
import Link from "next/link";
import { motion } from "framer-motion";

const Signin = () => {
  const session = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirected = useRef(false);
  useEffect(() => {
    if (redirected.current === false && session.data?.user) {
      const redirectUrl = localStorage.getItem("loginRedirectUrl") || searchParams.get("redirectUrl");
      localStorage.removeItem("loginRedirectUrl");
      router.replace(redirectUrl || "/");
      redirected.current = true;
    }
  }, [redirected, session, router]);

  return (
    <div className="flex flex-center h-screen">
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut", type: "spring", damping: 10 }}
        className="flex flex-col gap-12 justify-between bg-primary/5 p-8 rounded-2xl border border-primary/10 shadow-xl shadow-primary/5 min-w-[30vw]"
      >
        <div className="flex flex-col gap-12">
          <div className="flex flex-col text-center">
            <h2 className="font-semibold text-3xl md:text-4xl tracking-tighter">
              Welcome to{" "}
              <span className="font-bold bg-gradient-to-b from-blue-400 to-blue-700 bg-clip-text text-transparent tracking-tighter">
                100xProjects
              </span>
            </h2>
            <p className="text-primary/75 font-medium tracking-tighter text-lg md:text-xl">
              Log in to access paid content!
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div
              className="w-full flex gap-2 p-4 font-medium md:text-lg rounded-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer bg-gradient-to-b from-blue-400 to-blue-700 text-white justify-center items-center"
              onClick={async () => {
                await signIn("google");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 30 30"
                fill="currentColor"
                className="size-6 md:size-8 text-white"
              >
                <path d="M 15.003906 3 C 8.3749062 3 3 8.373 3 15 C 3 21.627 8.3749062 27 15.003906 27 C 25.013906 27 27.269078 17.707 26.330078 13 L 25 13 L 22.732422 13 L 15 13 L 15 17 L 22.738281 17 C 21.848702 20.448251 18.725955 23 15 23 C 10.582 23 7 19.418 7 15 C 7 10.582 10.582 7 15 7 C 17.009 7 18.839141 7.74575 20.244141 8.96875 L 23.085938 6.1289062 C 20.951937 4.1849063 18.116906 3 15.003906 3 z"></path>
              </svg>
              Continue with Google
            </div>
            <div
              className="w-full flex gap-2 p-4 font-medium md:text-lg rounded-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer bg-gradient-to-b from-blue-400 to-blue-700 text-white justify-center items-center"
              onClick={async () => {
                await signIn("github");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 30 30"
                fill="currentColor"
                className="size-6 md:size-8 text-white"
              >
                <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
              </svg>
              Continue with Github
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <Separator className="w-full my-2" />
          <Link href={"/"} className="flex items-center gap-2 cursor-pointer mx-auto">
            <Image
              src={"https://appx-wsb-gcp.akamai.net.in/subject/2023-01-17-0.17044360120951185.jpg"}
              alt="Logo"
              width={300}
              height={200}
              className="rounded-full size-16"
            />
            <div className="flex flex-col">
              <span className="font-bold bg-gradient-to-b from-blue-400 to-blue-700 bg-clip-text text-transparent text-4xl tracking-tighter">
                100xDevs
              </span>
              <p className="text-primary tracking-tight text-lg leading-none">because 10x ain't enough.</p>
            </div>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Signin;
