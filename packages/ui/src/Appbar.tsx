import Link from "next/link";
import { Button } from "."
import { User } from "@repo/store";
import { auth } from "@repo/common";
import { useRouter } from "next/navigation";

export const Appbar = ({user}: {user: User | null}) => {
    const router = useRouter();
    return <div className="bg-zinc-950 p-3 flex justify-center">
        <div className="max-w-screen-xl flex justify-between w-full">
            <Link href={"/"}>
                <div className="text-white text-2xl">
                    DailyCode
                </div>
            </Link>
            <div>
                {!user ? <Button variant={"outline"} onClick={() => {
                    router.push("/auth")
                }}>Login</Button> : ""}
                {user ? <Button variant={"outline"} onClick={() => {
                    auth.signOut().then(function() {
                        // Sign-out successful.
                      }, function(error) {
                        // An error happened.
                      });
                }}>Logout</Button> : ""}
            </div>
        </div>
    </div>
}