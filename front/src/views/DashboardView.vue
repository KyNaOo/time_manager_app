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
    console.log("NEW workingtimes:", workingTimes.value);

      } catch (e) {
    console.log("Error clocking:", e)
  }


}

onBeforeMount(async () => {
    try {
        user.value = store.user;
        console.log("Store user:", user.value);

        if (user.value) {
            await api.authenticate(`/api/users`, user.value);

            const [workingTimesResponse, clocksResponse] = await Promise.all([
                api.getWorkingTimes(user.value),
                api.getClocks(user.value)
            ]);

            if (workingTimesResponse) {
                console.log("Working times:", workingTimesResponse);
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
        console.log("Error fetching workingTimes or clocks:", e);
    }
});

</script>

<template>
    <div class="Dashboard">
        <div class="block block-one">
            <div class="flex-item user">
                <h2>  Hello {{ user?.username }}</h2>
              </div>
            <div class="flex-item">
                <h2> Action </h2>
                <nav>
                    <button :class="working ? 'clockOut' : 'clockIn'" @click="clock()">{{ working ? 'Clock Out' : 'Clock In' }}</button>
                </nav>
            </div>
        </div>
        <div class="block block-two">
            <ChartManager v-if="workingTimes" :workingTimes="workingTimes" />
        </div>
    </div>
</template>

<style scoped>
.Dashboard {
    padding: 20px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: start;
}


.block-one {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.flex-item {
    flex: 1;
    padding: 20px; 
    align-content: center;
}

.block-two {
    padding: 20px;
    text-align: center;
    border-radius: 4px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 10px;
}

.grid-item {
    background-color: #f0f0f0;
    padding: 20px;
    text-align: center;
    border: 1px solid #ddd;
    border-radius: 4px;
}
</style>
