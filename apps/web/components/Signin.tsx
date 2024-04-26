"use client";
import GoogleIcon from "../app/assets/google.svg";
import GithubIcon from "../app/assets/github.svg";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ModeToggle } from "../../../packages/ui/src/ModeToggle";
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
    <>
      <div className="bg-zinc-50 dark:bg-zinc-950 p-3 py-3 flex justify-center border-b shadow-md sticky top-0 z-50">
        <div className="max-w-screen-xl flex justify-between w-full">
          <Link href={"/"}>
            <div className="dark:text-zinc-100 text-zinc-950 text-2xl font-semibold">DailyCode</div>
          </Link>
          <div className="flex items-center gap-2">
            <ModeToggle />
          </div>
        </div>
      </div>
      <div className="flex bg-black h-[91.5vh]">
        <div className="w-full md:w-2/5 bg-zinc-200 dark:bg-zinc-950 flex justify-center items-center h-[91.5vh] max-sm:hidden max-md:hidden">
          <div>
            <h1 className="text-4xl font-bold mb-4 dark:text-zinc-100 text-zinc-950">Daily Code</h1>
            <div className="grid grid-cols-3 gap-4">
              {[...Array(9)].map((_, index) => (
                <div key={index} className="opacity-50">
                  <i className="fas fa-arrow-down fa-3x"></i>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full h-[91.5vh] md:w-3/5 bg-gray-900 flex justify-center items-center">
          <div className="w-full max-w-md">
            <div className="p-5">
              <h2 className="text-2xl font-semibold mb-2 text-white text-center">Log In</h2>
            </div>
            <div className=" mb-4  justify-center py-1 sm:px-6 lg:px-8 ">
              <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                  <div
                    className="absolute inset-0 bg-gradient-to-r bg-zinc-950 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl">
                  </div>
                  <div className="relative px-4 py-10 bg-background shadow-lg sm:rounded-3xl sm:p-16">
                    <div className="w-full flex justify-center">
                      <div className="w-full flex flex-col items-center justify-center gap-4">
                        <p className="font-normal text-2xl text-gray-900 dark:text-slate-300">Welcome</p>
                        <p className="font-light text-sm text-gray-600 dark:text-slate-200">Log in to continue to DailyCode.</p>
                        <button
                          type="submit"
                          className="w-full flex justify-center items-center gap-2 py-3 px-4 border rounded font-light text-md text-gray-900 dark:text-slate-200 hover:bg-gray-200  dark:hover:bg-gray-900 focus:outline-none "
                          onClick={async () => {
                            await signIn("google");
                          }}
                        >
                          <img src={GoogleIcon.src} className="w-5 h-5 mr-2" />
                          Continue with Google
                        </button>
                        <button
                          className="w-full flex justify-center items-center gap-2 py-3 px-4 border rounded font-light text-md text-gray-600 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-gray-900  focus:outline-none -mt-2"
                          onClick={async () => {
                            await signIn("github");
                          }}
                        >
                          <img src={GithubIcon.src} className="w-5 h-5 mr-2 dark:bg-gray-400 dark:rounded-full" />
                          Continue with Github
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export { GithubIcon };

export default Signin;
