import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./shad/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { LogOut, UserRound } from "lucide-react";

const dropDownData = [
  {
    name: "Profile",
    icon: <UserRound size={15} />,
    // href: "/profile"
  },
];

export default function UserAccountDropDown() {
  const session = useSession();
  const user = session.data?.user;
  return (
    <>
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger className="w-[2rem] flex items-center hover:bg-[#030712] p-[0.2rem]  justify-center h-[2rem]">
            {!user.image ? (
              <div className="p-1 border-2 rounded-md border-[#1a1a1a]">
                <UserRound />
              </div>
            ) : (
              <img
                className="w-full h-full rounded-full cursor-pointer"
                src={user?.image || ""}
                width={100}
                height={100}
                alt="user_profile_image"
              />
            )}
          </DropdownMenuTrigger>

          <DropdownMenuContent className=" max-w-[20rem] shadow-[#030712] translate-y-8 scale-110 -translate-x-10 shadow-xl">
            <DropdownMenuLabel className="flex gap-4 items-center">
              <div className="!w-[2rem] flex items-center hover:bg-[#030712] p-[0.2rem]  justify-center !h-[2rem]">
                {!user.image ? (
                  <div className="p-1 border-2 rounded-md border-[#1a1a1a]">
                    <UserRound />
                  </div>
                ) : (
                  <img
                    className="w-full h-full rounded-full cursor-pointer"
                    src={user?.image || ""}
                    width={100}
                    height={100}
                    alt="user_profile_image"
                  />
                )}
              </div>

              <div className="flex flex-col">
                <span className="max-w-[200px]">{user?.name}</span>
                <span className="text-[0.8rem] max-w-[200px] text-gray-400">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {dropDownData.map((item, index) => {
              return (
                <>
                  <DropdownMenuItem className="flex gap-2" key={index}>
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </DropdownMenuItem>
                </>
              );
            })}
            <DropdownMenuSeparator />
            {user && (
              <DropdownMenuItem
                onClick={async () => {
                  await signOut();
                }}
                className=" flex gap-2 focus:bg-[#f34e4e]"
              >
                <LogOut size={15} />
                Logout
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
