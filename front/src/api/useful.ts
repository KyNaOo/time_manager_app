import type { Clock, WorkingTime, User } from '@/types/crudTypes';
import axios from 'axios';





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
        await axios.post(`http://localhost:4000/api/clocks/${user.id}`, {
            time: now,
            status: true,
        });

        // Creation of working time
        await axios.post(`http://localhost:4000/api/workingtime/${user.id}`, {
            start: now,
            end: now
        });
    } catch (e) {
        console.log("Error clocking in:", e);
    }
}

async function clockOut(now: string, workingTimes: WorkingTime[], user: User) {
    try {
        // Creation of clock out
        await axios.post(`http://localhost:4000/api/clocks/${user.id}`, {
            time: now,
            status: false,
        });

        const lastWorkingTime = fetchLastWorkingTime(workingTimes);
        console.log("Last working time:", lastWorkingTime);

        if (lastWorkingTime) {
            // Update the end time of the last working time
            await axios.put(`http://localhost:4000/api/workingtime/${lastWorkingTime.id}`, {
                workingtime: { end: now }
            });
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