import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../../lib/auth";
import prisma from "@repo/db/client";

export async function GET(req: NextRequest, { params }: { params: { solutionId: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({message: 'Your not logged in.'}, {status: 401})
    }
    console.log(params);

    const solution = await prisma.solution.findUnique({
      where: {
        id: params.solutionId
      },
      include: {
        user: {
          select: {
            name: true,
            image: true
          }
        },
        language: {
          select: {
            label: true,
            value: true
          }
        }
      }
    })

    return NextResponse.json({solution: solution}, {status: 200}) 
    
  } catch (error) {
    return NextResponse.json({message: 'An internal error occured'}, {status: 500})
  }
} 
