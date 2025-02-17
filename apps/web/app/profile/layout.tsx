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
    <div className="bg-background min-h-screen font-sans antialiased">
      <AppbarClient />
      <div className="m-auto flex max-w-screen-xl p-4">
        <div className="grid w-full grid-cols-8 gap-2 p-2">
          <ProfileSidebar />
          <ProfileChilldren>{children}</ProfileChilldren>
        </div>
      </div>
    </div>
  );
}
