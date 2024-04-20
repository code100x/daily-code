import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@repo/ui/utils";
import { Providers, ThemeProvider } from "../../components/Providers";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { redirect } from "next/navigation";
import { getAllTracks } from "../../components/utils";
import { AppbarClient } from "../../components/AppbarClient";
import ProfileSidebar from "../../components/ProfileSidebar";
import ProfileChilldren from "../../components/ProfileChilldren";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Dailycode",
  description: "Code daily",
};

const session = await getServerSession(authOptions);
if (!session || !session?.user) {
  redirect("/auth");
}
const tracks = await getAllTracks();

export default function ProfileLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <AppbarClient tracks={tracks} />
        <div className="max-w-screen-xl flex p-4 m-auto">
          <div className="p-2 w-full grid grid-cols-8 gap-2">
            <ProfileSidebar />
            <ProfileChilldren>{children}</ProfileChilldren>
          </div>
        </div>
      </body>
    </html>
  );
}
