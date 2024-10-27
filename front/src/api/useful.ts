import type { Clock, WorkingTime, User, Team } from '@/types/crudTypes';
import axios from 'axios';
import { useApi } from '@/api/index';
import instance from './axios';


const api = useApi();


function fetchLastClock(clocks : Clock[]) {
    const lastClock = clocks ? clocks[clocks.length - 1] : null;
    return lastClock;
}

function fetchLastWorkingTime(workingTimes : WorkingTime[]) {
    const lastWorkingTime = workingTimes ? workingTimes[workingTimes.length - 1] : null;
    return lastWorkingTime;
}

async function clockIn(now: string, user: User) {
    try {
        await api.createClock(user, now, true);

        await api.createWorkingTime(user, now);

    } catch (e) {
        console.log("Error clocking in:", e);
    }
}

async function clockOut(now: string, workingTimes: WorkingTime[], user: User) {
    try {
        await api.createClock(user, now, false);


        const lastWorkingTime = fetchLastWorkingTime(workingTimes);
        console.log("Last working time:", lastWorkingTime);

        if (lastWorkingTime) {
            await api.modifyWorkingTime(now, lastWorkingTime);
        }
    } catch (e) {
        console.log("Error clocking out:", e);
    }
}

async function calculateWorkingTime(workingTimes: WorkingTime[]) {

    console.log("Calculating Working Times");

    const dates: any[] = [];
    // First loop to find the dates of the working times
    for (let i = 0; i < workingTimes.length; i++) {
        const date = new Date(workingTimes[i].start);
        date.setHours(0, 0, 0, 0); // Set to the start of the day

        // Check if the date is already in the dates array
        if (!dates.some(d => d.getTime() === date.getTime())) {
            dates.push(date);
        }
    }

    console.log("Working Dates:", dates);   

    // Second loop to calculate the total working time for each date
    const totalWorkingTime: { date: Date, totalWorkingTime: number }[] = [];
    for (let i = 0; i < dates.length; i++) {
        let dailyWorkingTime = 0;
        for (let j = 0; j < workingTimes.length; j++) {
            const date = new Date(workingTimes[j].start);
            date.setHours(0, 0, 0, 0); // Set to the start of the day
            if (date.getTime() === dates[i].getTime()) {
                const start = new Date(workingTimes[j].start);
                const end = new Date(workingTimes[j].end);
                dailyWorkingTime += (end.getTime() - start.getTime());
            }
        }
        totalWorkingTime.push({ date: dates[i], totalWorkingTime: dailyWorkingTime });
    }

    // Order the total working time by date
    console.log("Total Working Time:", totalWorkingTime);

    totalWorkingTime.sort((a, b) => a.date.getTime() - b.date.getTime());

    console.log("Oredered Total Working Time:", totalWorkingTime);


    console.log("Total Working Time:", totalWorkingTime);
    return totalWorkingTime;
}

export const usefulFunctions = () =>{
    return {
        fetchLastClock,
        fetchLastWorkingTime,
        clockIn,
        clockOut,
        calculateWorkingTime
    }
};