import type { Clock, WorkingTime, User } from '@/types/crudTypes';
import axios from 'axios';
import { useApi } from '@/api/index';
import instance from './axios';

const api = useApi();


function fetchLastClock(clocks : Clock[]) {
    // get last clock from user
    const lastClock = clocks ? clocks[clocks.length - 1] : null;
    return lastClock;
}

// Creation of clock in
function fetchLastWorkingTime(workingTimes : WorkingTime[]) {
    // get last working time from user
    const lastWorkingTime = workingTimes ? workingTimes[workingTimes.length - 1] : null;
    return lastWorkingTime;
}

async function clockIn(now: string, user: User) {
    try {
        // Creation of clock in
        await api.createClock(user, now, true);

        // Creation of working time
        await api.createWorkingTime(user, now);

    } catch (e) {
        console.log("Error clocking in:", e);
    }
}

async function clockOut(now: string, workingTimes: WorkingTime[], user: User) {
    try {
        // Creation of clock out
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

export const usefulFunctions = () =>{
    return {
        fetchLastClock,
        fetchLastWorkingTime,
        clockIn,
        clockOut
    }
};