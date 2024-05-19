import type { Metadata } from "next";
import { AppbarClient } from "../../components/AppbarClient";
import ProfileSidebar from "../../components/ProfileSidebar";
import ProfileChilldren from "../../components/ProfileChildren";

export const metadata: Metadata = {
  title: "Dailycode",
  description: "Code daily",
};

export default function ProfileLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <AppbarClient />
      <div className="max-w-screen-xl flex p-4 m-auto">
        <div className="p-2 w-full grid grid-cols-8 gap-2">
          <ProfileSidebar />
          <ProfileChilldren>{children}</ProfileChilldren>
        </div>
      </div>
    </div>
  );
}
