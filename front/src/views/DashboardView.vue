<script setup lang="ts">
import { ref } from 'vue';
import ChartManager from '@/components/ChartManager.vue';
import { onBeforeMount } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import {useApi} from '@/api/index';
import { store } from "../api/store";
import type { User,WorkingTime, Clock } from "@/types/crudTypes";
import {usefulFunctions} from "@/api/useful";
import moment from 'moment';
import WorkingTimes from '@/components/WorkingTimes.vue';
import Users from "@/components/Users.vue";
import {useAuth} from "@/api/auth";

const route = useRoute();
const api = useApi();
const useful = usefulFunctions();

const workingTimes = ref<WorkingTime[] | null>(null);
const clocks = ref<Clock[] | null>(null);
const user = ref<User | null>(null);
const working = ref(false);


async function clock() {
  try {
    
    if (!user.value) {
        console.error('User is null')
        return
    }
    const now = moment().format('YYYY-MM-DD HH:mm:ss');

    clocks.value = await api.getClocks(user.value);

    console.log("All clocks:", clocks.value)

    let lastClock = useful.fetchLastClock(clocks.value!);

    console.log("Last clock:", lastClock)

    if (lastClock && lastClock.status) {
        // clock out
        await useful.clockOut(now, workingTimes.value!, user.value);
        working.value = false;

    } else {
        // clock in
        await useful.clockIn(now, user.value);
        working.value = true;
    }

    // Reload the data
    workingTimes.value =  await api.getWorkingTimes(user.value);
    clocks.value = await api.getClocks(user.value);

    // Reload page
    window.location.reload();


    console.log("NEW workingtimes:", workingTimes.value);

      } catch (e) {
    console.log("Error clocking:", e)
  }


}

onBeforeMount(async () => {
    try {
        user.value = await store.user;
        console.log("User in Store:", user.value);
        if (user.value) {
            const [workingTimesResponse, clocksResponse] = await Promise.all([
                api.getWorkingTimes(user.value),
                api.getClocks(user.value)
            ]);

            if (workingTimesResponse) {
                console.log("Working times from Promise:", workingTimesResponse);
                workingTimes.value = workingTimesResponse;
            }

            if (clocksResponse) {
                console.log("All clocks:", clocksResponse);
                clocks.value = clocksResponse;

                const lastClock = useful.fetchLastClock(clocks.value!);
                console.log("Last clock:", lastClock);

                working.value = lastClock && lastClock.status ? true : false;
                console.log(`User is ${working.value ? 'working' : 'not working'} !!`);
            }
        }
    } catch (e) {
        console.log("Error mounting Dashboard:", e);
    }
});

</script>

<template>
    <div class="Dashboard">
        <div class="block user">
            <div class="flex-item user">
                <h2>  Hello {{ user?.username }} !</h2>
              </div>
            <div class="flex-item clockBlock">
                <div v-if="working && workingTimes" class="workingBlock">
                    <h3> You are currently working 🤓 </h3>
                    <div class="lastWorkingTime">
                        <div class="timeWrapper">
                            <h4 >Started at:</h4>
                            <span class="time startTime">{{ workingTimes[workingTimes.length - 1].start }}</span>
                        </div>
                        <div class="timeWrapper">
                            <h4>End (not real):</h4>
                            <span class="time endTime">{{ workingTimes[workingTimes.length - 1].end }}</span>
                        </div>
                    </div>
                </div>
                <div v-else class="notWorkingBlock">
                    <h3> Clock In to start working 😮‍💨</h3>
                </div>
                <button :class="working ? 'clockOut' : 'clockIn'" @click="clock()">{{ working ? 'Clock Out' : 'Clock In' }}</button>
            </div>
        </div>
        <template v-if="workingTimes?.length">
        <div class="block chart">
            <ChartManager :workingTimes="workingTimes" />
        </div>
        <div class="block currentClockWrapper">
            <WorkingTimes v-if="user" :user="user" />
        </div>
        </template>
        <template v-else>
            <div class="block chart">
                <h2>No data to show yet 😓</h2>
                <p>Start working to see your progress</p>
            </div>
        </template>

        <!-- v-if="user?.role === 'manager'"  -->
        <div class="block allUsers">
            <Users/>
        </div>
       
    </div>
</template>

<style scoped>

h2 {
    font-size: 30px;
}
h4 {
    font-weight: bold;
}
.Dashboard {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: start;
    gap: 20px;
}

.block{
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 20px;
    border-radius: 8px;

}

.clockBlock{
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;

    align-items: self-start;
}

.flex-item {
    flex: 1;
    align-content: center;
    margin: 20px 0;
}


.grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 10px;
}

.grid-item {
    background-color: #f0f0f0;
    text-align: center;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.workingBlock {
    width: 100%
}
.lastWorkingTime {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 20px;
}

.timeWrapper {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.time {
    font-size: 14px;
    font-weight: bold;
    border-radius: 10px;
    padding: 10px 5px;
}

.startTime {
    background-color: #4CAF50;
    color: white;
}

.endTime {
    background-color: lightgray;
    color: white;
}

.clockIn {
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    width: fit-content;
    font-size: medium;
}

.clockOut {
    padding: 10px;
    background-color: #ff4d4d;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    width: fit-content;
}

</style>
