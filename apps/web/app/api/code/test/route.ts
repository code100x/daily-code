import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, rateLimit } from "../../../../lib/auth";
import { fetchSubmissions } from "../../../../lib/code";

const [rateLimitCount, rateLimitInterval] = [
  process.env.CODE_SUBMISSION_RATE_LIMIT_COUNT || 5,
  process.env.CODE_SUBMISSION_RATE_LIMIT_INTERVAL || 60000,
];

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  if (!rateLimit(userId, Number(rateLimitCount), Number(rateLimitInterval))) {
    return NextResponse.json({ message: "Rate Limit Exceeded. Please try again later." }, { status: 401 });
  }

  const { submissions } = await req.json();

  const API_URL = `${process.env.JUDGE0_API_URL}/submissions/batch`;
  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      submissions,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data: any[] = await res.json();
  const tokenString = data.map((props: any) => props.token).join(",");

  const processedSubmissions = await new Promise<any[]>((resolve) => {
    setTimeout(async () => {
      fetchSubmissions(tokenString, resolve);
    }, 1000);
  });

  if (processedSubmissions.length === 0) {
    return NextResponse.json({ message: "Time Limit Exceeded" }, { status: 500 });
  }

  return NextResponse.json({ submissions: processedSubmissions });
}
