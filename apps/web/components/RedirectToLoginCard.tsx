"use client";
import { usePathname, useRouter } from "next/navigation";
import { Card, CardDescription, CardHeader, CardTitle, Button, CardFooter } from "@repo/ui";

const RedirectToLoginCard = () => {
  const router = useRouter();
  const pathname = usePathname();
  const redirectToLogin = () => {
    localStorage.setItem("loginRedirectUrl", pathname);
    router.push("/auth");
  };
  return (
    <div className="flex items-center justify-center min-h-screen text-center">
      <Card className="p-6 ">
        <CardHeader>
          <CardTitle>Login To Continue</CardTitle>
          <CardDescription>Login to access all the content</CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button onClick={redirectToLogin}>Login</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RedirectToLoginCard;
