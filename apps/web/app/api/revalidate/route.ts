import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const password = data.password;
  if (!password) {
    return NextResponse.json({}, { status: 401 });
  }

  // later on this path will be received in the request to revalidate blogs as and when admin requests.
  const path = "/";

  // eslint-disable-next-line turbo/no-undeclared-env-vars
  if (password === process.env.REVAL_PASSWORD) {
    revalidatePath(path);
    return NextResponse.json({ message: "re-validated" });
  }

  return NextResponse.json({}, { status: 500 });
}
