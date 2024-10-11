<script setup lang="ts">
import axios from "axios";
import {onBeforeMount, ref} from "vue";
import moment from "moment";

interface WorkingTime {
  id: number;
  start: string;
  end: string;
}
interface Clock {
  id: number;
  time: string;
  status: boolean;
}

interface User {
  id?: number ;
  username: string;
  email: string;
}

interface Props {
    user: User ;
}
const props = defineProps<Props>();

const workingTimes = ref<WorkingTime[] | null>(null);

const clocks = ref<Clock[] | null>(null);

const clicked = ref(false);


// Get all clocks from user
async function getClocks() {
    try {
        // get all clocks from user
        const res =  await axios.get(`http://localhost:4000/api/clocks/${props.user.id}`);
        return res.data.data;
    } catch (e) {
        console.log("Error fetching clocks:", e);
    }
}

function fetchLastClock() {
    // get last clock from user
    const lastClock = clocks.value ? clocks.value[clocks.value.length - 1] : null;
    return lastClock;
}

// Creation of clock in
function fetchLastWorkingTime() {
    // get last clock from user
    const lastWorkingTime = workingTimes.value ? workingTimes.value[workingTimes.value.length - 1] : null;
    return lastWorkingTime;
}


async function clockIn(now :string, midnight :string) {

     // Creation of clock in
     const clock = await axios.post(`http://localhost:4000/api/clocks/${props.user.id}`,
    {
        time: now,
        status: true,
    }
    );

    // Creation of working time
        const workingTime = await axios.post(`http://localhost:4000/api/workingtime/${props.user.id}`,
    {
        start: now,
        end: midnight
    }
    );
}

async function clockOut(now : string){
     // Creation of clock in
     const clock = await axios.post(`http://localhost:4000/api/clocks/${props.user.id}`,
    {
        time: now,
        status: false,
    }
    );

    const lastWorkingTime = fetchLastWorkingTime();
    console.log("Last working time:", lastWorkingTime);

    if (lastWorkingTime ) {
        // Creation of working time
        const workingTime = await axios.put(`http://localhost:4000/api/workingtime/${lastWorkingTime.id}`,
        {
           workingtime:{ end: now}
        }
        );
        return;
    }


}

async function clock() {
  try {
    
    const now = moment().format('YYYY-MM-DD HH:mm:ss');
    const midnight = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');

    clocks.value = await getClocks();

    console.log("All clocks:", clocks.value)

    const lastClock = fetchLastClock();

    console.log("Last clock:", lastClock)

    if (lastClock && lastClock.status) {
        // clock out
        clockOut(now);
    } else {
        // clock in
        clockIn(now, midnight);
    }

    // Reload the page
    // window.location.reload();

    clicked.value = !clicked.value;

      } catch (e) {
    console.log("Error clocking:", e)
  }


}

onBeforeMount(async () => {
  try {
    const apiResp = await axios.get(`http://localhost:4000/api/workingtime/${props.user.id}`);
    workingTimes.value = apiResp.data.data;
    console.log("workingtimes:", workingTimes.value)
  } catch (e) {
    console.log("Error fetching workingtimes:", e)
  }

})

</script>

<template>
<div v-if="workingTimes">
  <h3>Working Times</h3>
  <!-- <RouterLink to="/workingtime/create" >Create Working Time</RouterLink> -->
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>User Id</th>
        <th>Start</th>
        <th>End</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="workingTime in workingTimes" :key="workingTime.id">
        <td>{{ workingTime.id }}</td>
        <td>{{ user.id }}</td>
        <td>{{ workingTime.start }}</td>
        <td>{{ workingTime.end }}</td>
      </tr>
      <nav>
            <button @click="clock()">{{ clicked ? 'Clock Out' : 'Clock In' }}</button>
            <!-- <button @click="clock(new Date)">Clock Out</button> -->
        </nav>
    </tbody>
  </table>
</div>
<div v-else>No Working Times Yet
</div>
</template>

<style scoped>

</style>