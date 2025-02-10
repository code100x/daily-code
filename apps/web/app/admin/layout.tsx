import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import Link from "next/link";
import { LockClosedIcon } from "@radix-ui/react-icons";
import { ReactNode } from "react";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.admin) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center gap-4 p-4">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="flex flex-col items-center space-y-2">
            <LockClosedIcon className="h-14 w-14" />
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Access Denied</h1>
              <p className="text-sm text-gray-500 md:text-base dark:text-gray-400">
                You do not have permission to access this page.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
              href="/"
            >
              Return to the homepage
            </Link>
          </div>
        </div>
      </div>
    );
  } else {
    return <>{children}</>;
  }
}
