import type { Clock, WorkingTime, User } from '@/types/crudTypes';
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

export const usefulFunctions = () =>{
    return {
        fetchLastClock,
        fetchLastWorkingTime,
        clockIn,
        clockOut
    }
};