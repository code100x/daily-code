'use client'
import React, { useState } from 'react'
import Calendar from './Calendar'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/select';

interface CalendarRendererProps {
    acceptedSubmissions: any;
    monthData: string[];
}

export default function CalendarRenderer({ acceptedSubmissions, monthData }: CalendarRendererProps) {
    const [selectedMonth, setSelectedMonth] = useState(String(new Date().getMonth()));
    const [selectedYear, setSelectedYear] = useState(String(new Date().getFullYear()));
    const selectedMonthSubmissionsDates: string[] = acceptedSubmissions?.map((x: any) => x.createdAt.toLocaleString("en-GB")).filter((date: any) => Number(date.split(',')[0].split("/")[1]) - 1 === Number(selectedMonth) && Number(date.split(',')[0].split('/')[2]) === new Date().getFullYear());
    const yearWiseSubmissionDates: string[] = acceptedSubmissions?.map((x: any) => x.createdAt.toLocaleString("en-GB")).filter((date: any) => Number(date.split(',')[0].split('/')[2]) === Number(selectedYear));

    const generateYearsData = (currentYear: number) => {
        let finalYearsArray = [];
        let it = 0;
        while (currentYear >= 2023) {
            finalYearsArray[it] = currentYear;
            currentYear--;
            it++;
        }
        return finalYearsArray;
    }

    return (
        <div className='flex flex-col'>
            <div className='flex flex-wrap gap-2 mb-2 items-center justify-between p-3'>
                <div className='text-xl font-semibold'>{selectedMonthSubmissionsDates && selectedMonthSubmissionsDates.length} Submission(s) <span className='text-xs opacity-80'>in {monthData[Number(selectedMonth)]} {new Date().getFullYear()}</span></div>
                <div>
                    <Select value={selectedMonth} onValueChange={(val) => setSelectedMonth(val)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {monthData.map((item: string, index: number) => {
                                    if (index > new Date().getMonth()) {
                                        return;
                                    }
                                    return (
                                        <SelectItem key={`select-month-${index}`} className='cursor-pointer' value={String(index)}>{item}</SelectItem>
                                    );
                                })}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Rendering Single month Calendar */}
            <main className='flex overflow-auto border-b-2 pb-4 items-center gap-2 pr-4 h-fit'>
                <Calendar
                    submissionDates={selectedMonthSubmissionsDates}
                    selectedMonth={Number(selectedMonth)}
                    monthData={monthData}
                    type={"single"}
                    isCurrentMonth={new Date().getMonth() === Number(selectedMonth)}
                    selectedYear={new Date().getFullYear()}
                />
            </main>

            <div className='my-3 px-3 flex flex-wrap gap-2 mb-2 items-center justify-between text-xl font-semibold'>
                <div>
                    {yearWiseSubmissionDates && yearWiseSubmissionDates.length} Submissions <span className='text-xs opacity-80'>in {selectedYear}</span>
                </div>
                <div>
                    <Select value={selectedYear} onValueChange={(val) => setSelectedYear(val)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {generateYearsData(new Date().getFullYear()).map((item, index) => (
                                    <SelectItem className='cursor-pointer' value={String(item)}>{item}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Rendering each month Calendar */}

            <main className='flex max-w-full overflow-auto mt-10 items-center m-auto gap-2 px-4 h-fit'>
                {
                    monthData.map((item: string, index: number) => {
                        const eachMonthSubmissionDates = acceptedSubmissions?.map((x: any) => x.createdAt.toLocaleString("en-GB")).filter((date: any) => Number(date.split("/")[1]) - 1 === Number(index) && Number(date.split(',')[0].split('/')[2]) === Number(selectedYear));
                        const isCurrentMonth = new Date().getMonth() === Number(index) && new Date().getFullYear() === Number(selectedYear);
                        return (
                            <div key={`each-month-render-${index}`} className={`${(index <= new Date().getMonth() && new Date().getFullYear() === Number(selectedYear)) ? "opacity-100" : "opacity-25"} flex flex-col gap-4 pb-4 items-center`}>
                                <Calendar
                                    childKey={`each-month-render-calendar-${index}`}
                                    selectedYear={Number(selectedYear)}
                                    type={"multiple"}
                                    isCurrentMonth={isCurrentMonth}
                                    submissionDates={eachMonthSubmissionDates}
                                    selectedMonth={index}
                                    monthData={monthData}
                                />
                                <div className={`${isCurrentMonth ? "bg-[#3b82f6]" : "border-none"} w-full flex items-center justify-center py-[0.125rem] text-xs rounded-md`}>
                                    {item.slice(0, 3)}
                                </div>
                            </div>
                        );
                    })
                }
            </main>
            <div className='flex items-center mt-4 justify-end px-4 h-[4rem]'>
                <div className='flex gap-2 font-semibold items-center'>
                    <span>Less</span>
                    {['#161b22', '#006d32', '#26a641', '#39d353'].map((colorHash, index) => (
                        <span key={`color-hash-${index}`} className={`w-[0.8rem] h-[0.8rem] rounded-sm bg-[${colorHash}]`}></span>
                    ))}
                    <span>More</span>
                </div>
            </div>
        </div>
    )
}
