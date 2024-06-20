import React, { useMemo } from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@repo/ui/tooltip"

interface CalendarProps {
    childKey?: string;
    type: string;
    submissionDates: string[],
    selectedMonth: number;
    selectedYear: number;
    isCurrentMonth: boolean;
    monthData: string[],
}

function Calendar({ childKey, type, submissionDates, isCurrentMonth, monthData, selectedMonth, selectedYear }: CalendarProps) {

    const date = new Date();
    const currMonth = selectedMonth;
    const currYear = selectedYear;
    const currDate = date.getDate();
    // const currDay = date.getDay();

    let firstDayOfMonth = new Date(currYear, currMonth, 1).getDay();
    let LastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate()
    let LastDateOfLastMonth = new Date(currYear, currMonth, 0).getDate()

    const getDatesOfLastMonth = (firstDayOfMonth: number, LastDateOfLastMonth: number) => {
        return Array.from(
            { length: firstDayOfMonth },
            (_, index) => LastDateOfLastMonth - firstDayOfMonth + index + 1
        );
    };

    //getting the dates of current month
    const getCurrMonthDates = (LastDateOfMonth: number): number[] => {
        const dates: number[] = [];
        for (let date = 1; date <= LastDateOfMonth; date++) {
            dates.push(date);
        }
        return dates;
    }

    // getting the dates of last month
    const datesOfLastMonth = useMemo<number[]>(() => {
        return getDatesOfLastMonth(firstDayOfMonth, LastDateOfLastMonth)
    }, [currMonth, currYear]);

    const currMonthDateArray = useMemo<number[]>(() => {
        return getCurrMonthDates(LastDateOfMonth);
    }, [currMonth, currYear]);

    const datesNumber: number[] = submissionDates.map((item: string) => Number(item?.split("/")[0]));
    const dateFrequency = useMemo<number[]>(() => {
        return datesNumber.reduce((acc: any, date: any) => {
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});
    }, [submissionDates]);

    const renderColorIntensity = (frequency: number) => {
        if (frequency === 0) {
            return 'bg-[#161b22]';
        } else if (frequency > 0 && frequency <= 5) {
            return 'bg-[#006d32]';
        } else if (frequency > 5 && frequency <= 10) {
            return 'bg-[#26a641]';
        } else if (frequency > 10) {
            return 'bg-[#39d353]';
        }
    }
    return (
        <div key={childKey} className='grid grid-rows-7 grid-flow-col gap-x-1 gap-y-1 mx-auto'>
            {/* to add gaps before the new month starts */}
            {datesOfLastMonth.map((date, index) => (
                <div key={`empty-${index}`} className={`invisible row-span-1`} />
            ))}

            <TooltipProvider>
                {currMonthDateArray.map((x, dayIndex) => {
                    const isMatching: boolean = datesNumber.some((item: number) => Number(item) == x);
                    const frequency = dateFrequency[x] || 0;
                    return (
                        <React.Fragment key={`entire-box-with-tootltip-${dayIndex}`}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div
                                        key={`box-${dayIndex + 1}`}
                                        className={`${isMatching ? (renderColorIntensity(frequency)) : `bg-[#a2a2a2] dark:bg-[#393939]`} ${(currDate <= dayIndex && isCurrentMonth) && "opacity-25"} cursor-pointer row-span-1 ${type === 'single' ? "w-[1rem] h-[1rem] rounded-[3px]" : "w-[0.58rem] h-[0.58rem]  rounded-[1px]"}`}
                                    >
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent className='bg-[#202020] text-white'>
                                    <p key={`box-title-${dayIndex + 1}`}>{frequency} submissions on {monthData[selectedMonth]} {x} , {selectedYear}</p>
                                </TooltipContent>
                            </Tooltip>
                        </React.Fragment>
                    );
                })}
            </TooltipProvider>
        </div>
    )
}

export default React.memo(Calendar);