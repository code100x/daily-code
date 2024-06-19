"use client";
import { usePathname, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from "@repo/ui";

const RedirectToLoginCard = () => {
  const router = useRouter();
  const pathname = usePathname();
  const redirectToLogin = () => {
    localStorage.setItem("loginRedirectUrl", pathname);
    router.push("/auth");
  };
  return (
    <Card className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg min-w-[340px]">
      <CardHeader>
        <CardTitle>Login to access the content</CardTitle>
        <CardDescription>You'll be redirected back to this page after login</CardDescription>
      </CardHeader>
      <CardContent className="px-4">
        <Button className="w-full mt-2" onClick={redirectToLogin}>
          Go to Login Page
        </Button>
      </CardContent>
    </Card>
  );
};

export default RedirectToLoginCard;
