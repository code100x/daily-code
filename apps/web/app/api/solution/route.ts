import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../lib/auth";
import prisma from "@repo/db/client";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "You are not logged in." }, { status: 401 });
    }

    const userId = session.user.id;
    const { problemStatementId, title, explanation, code, languageId } = await req.json();

    const solution = await prisma.solution.create({
      data: {
        problemStatementId: problemStatementId,
        title: title,
        explanation: explanation,
        code: code,
        languageId: languageId,
        userId: userId,
      },
    });

    return NextResponse.json({ solution: solution }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: `An error occured. Please try again later. Error: ${error}` }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "You are not logged in." }, { status: 401 });
    }
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.search);
    const problemId = searchParams.get("problemStatementId");
    console.log('problemId', problemId)

    if (!problemId) return;
        
    const solutions = await prisma.solution.findMany({
      where: {
        problemStatementId: problemId
      },
      include: {
        user: {
          select: {
            name: true
          }
        },
        language: {
          select: {
            label: true
          }
        }
      }
    });
    
    return NextResponse.json({solutions: solutions}, {status: 200});
  } catch (error) {
    return NextResponse.json({ message: "An internal rrror occured" }, { status: 500 });
  }
}
