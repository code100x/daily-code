import React from 'react'
import { AreaChart } from "lucide-react"
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { redirect } from 'next/navigation';
import db from "@repo/db/client";
import CalendarRenderer from '../../../components/CalendarRenderer';

export default async function Heatmap() {

    const session = await getServerSession(authOptions);
    const monthData = ['January', 'February', 'March', 'April', 'May', 'June', 'July', "August", "September", "October", "November", "December"];

    if (!session || !session?.user) {
        redirect("/");
    }

    const getAllSubmissions = async () => {
        if (!session || !session.user) {
            return null;
        }

        const userId = session.user.id;
        const submissions = await db.submission.findMany({
            where: {
                userId,
            },
            include: {
                language: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return submissions;
    };

    const submissions = await getAllSubmissions();

    const acceptedSubmissions = submissions?.filter((submission: any) => submission.statusId <= 3);

    return (
        <>
            <header className="border-b-2 p-3">
                <div className="px-2 w-[70%]">
                    <h1 className="text-lg lg:text-2xl flex items-center gap-2 font-semibold w-fit">
                        <AreaChart color="#3b82f6" />
                        <span>Heatmap</span>
                    </h1>
                    <span className="text-xs leading-normal text-gray-400">
                        This page shows you your submissions visually in the form of heatmap
                    </span>
                </div>
            </header>

            <CalendarRenderer
                acceptedSubmissions={acceptedSubmissions}
                monthData={monthData}
            />

        </>
    )
}
