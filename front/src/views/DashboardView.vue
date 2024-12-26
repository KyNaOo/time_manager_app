<script setup lang="ts">
import { ref } from 'vue';
import ChartManager from '@/components/ChartManager.vue';
import { onBeforeMount } from 'vue';
import axios from 'axios';
import Teams from "@/views/TeamsView.vue"
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

    if (lastClock && lastClock.status === true) {
        console.log("Clocking out...");
        console.log("Last clock:", lastClock);
        console.log("Working times:", workingTimes.value);
        await useful.clockOut(now, workingTimes.value!, user.value);
        working.value = false;

    } else {
        console.log("Clocking in...")
        console.log("now:", now);
        await useful.clockIn(now, user.value);
        working.value = true;
    }
    updateWorkingStatus(user.value);

      } catch (e) {
    console.log("Error clocking:", e)
  }


}

async function updateWorkingStatus(user : User) {
    const [workingTimesResponse, clocksResponse] = await Promise.all([
                api.getWorkingTimes(user),
                api.getClocks(user)
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

onBeforeMount(async () => {
    try {
        user.value = await store.user;
        if (user.value) {
            updateWorkingStatus(user.value);
        }
    } catch (e) {
        console.log("Error mounting Dashboard:", e);
    }
});

</script>

<template>
    <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'>
    <div v-if="user" class="Dashboard" >
        <div class="block user">
            <div class="flex-item user">
                <h2>Heyyy {{ user?.username }} !</h2>
              </div>
            <div class="flex-item clockBlock">
                <div v-if="working && workingTimes" class="workingBlock">
                    <h3> J'ai l'impression que tu es déjà entrain de veiller sur Gottham City ! </h3>
                    <div class="lastWorkingTime">
                        <div class="timeWrapper start">
                            <h4 >Tu as commencé à :</h4>
                            <span class="time startTime">{{ workingTimes[workingTimes.length - 1].start }}</span>
                        </div>
                        <div class="timeWrapper end">
                            <h4>End (not real):</h4>
                            <span class="time endTime">{{ workingTimes[workingTimes.length - 1].end }}</span>
                        </div>
                    </div>
                </div>
                <div v-else class="notWorkingBlock">
                    <h3> D'un simple "clock in" à un rapide "clock out", prenez le contrôle <br> de votre journée en un clin d'œil – pas besoin de Bat-Signal ! 😮‍💨</h3>
                </div>
                <button :class="working ? 'clockOut' : 'clockIn'" @click="clock()">{{ working ? 'Clock Out' : 'Clock In' }}</button>
            </div>
        </div>
        <template v-if="workingTimes?.length">
        <div class="block chart">
            <ChartManager :workingTimes="workingTimes" />
        </div>
        <div class="block currentClockWrapper">
            <WorkingTimes :user="user" :workingTimes="workingTimes" />
        </div>
        </template>
        <template v-else>
            <div class="block chart">
                <h2>Tu n'as enregistré aucune heure</h2>
                <p>Commence a veiller pour voir tes clocks</p>
            </div>
        </template>
        <div class="block TeamsBlock">
            <Teams :user="user" />
        </div>
        <div v-if="user?.role === 'admin'" class="block allUsers">
            <Users/>
        </div>
       
    </div>
</template>

<style scoped>

h2 {
    font-size: 38px;
    font-weight: bold;
    text-transform: uppercase;
}
h3 {
    margin-bottom: 10px;
    font-weight: lighter;
}
h4 {
    font-weight: bold;
}
.Dashboard {
    width: 70%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: start;
    gap: 25px;
    font-family: 'Poppins';
}

.chart{
    padding: 60px 80px;
    border-radius: 8px;
    background-color: #353535;
    color: white;
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

.start {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 10px;
}

.start span {
    text-align: center;
    padding: 8px 4px;
    font-size: 12px;
}

.end {
    display: none;
}

.time {
    font-size: 14px;
    font-weight: bold;
    border-radius: 5px;
    padding: 10px 5px;
}

.startTime {
    background-color: #3b913d;
    color: white;
}

.endTime {
    background-color: lightgray;
    color: white;
}

.clockIn {
    padding: 12px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    width: fit-content;
    font-size: 16px;
    font-weight: bold;
    text-transform: uppercase;
}

.clockIn:hover {
    cursor: pointer;
    transition: 0.4s;
    background-color: #1e481f;
}

.clockOut {
    padding: 12px 20px;
    background-color: #cd1d1d;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    width: fit-content;
    font-size: 16px;
    font-weight: bold;
    text-transform: uppercase;
}

.clockOut:hover {
    cursor: pointer;
    transition: 0.4s;
    background-color: #671e1e;
}

</style>
