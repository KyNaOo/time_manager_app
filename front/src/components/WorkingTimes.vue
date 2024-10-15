<script setup lang="ts">
import axios from "axios";
import {onBeforeMount, ref} from "vue";
import moment from "moment";
import type { User,WorkingTime, Clock } from "@/types/crudTypes";
import { useApi } from "@/api";
import {usefulFunctions} from "@/api/useful";

interface Props {
    user: User ;
}
const props = defineProps<Props>();

const workingTimes = ref<WorkingTime[] | null>(null);

const clocks = ref<Clock[] | null>(null);


const working = ref(false);

const api = useApi();

const useful = usefulFunctions();


onBeforeMount(async () => {
  try {
    workingTimes.value =  await api.getWorkingTimes(props.user);
    console.log("workingtimes:", workingTimes.value);

    clocks.value = await api.getClocks(props.user);

    const lastClock = useful.fetchLastClock(clocks.value!);
    console.log("Last clock:", lastClock);
    if (lastClock && lastClock.status) {
        console.log("User is working !!");
        working.value = true;
    }else {
        console.log("User is not working !!");
        working.value = false;
    }
  } catch (e) {
    console.log("Error fetching workingtimes:", e)
  }

})

</script>

<template>
<div v-if="workingTimes">
  <h2>Working Times</h2>
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>User Id</th>
        <th>Start</th>
        <th>End</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="workingTime in workingTimes" :key="workingTime.id">
        <td>{{ workingTime.id }}</td>
        <td>{{ user.id }}</td>
        <td>{{ workingTime.start }}</td>
        <td>{{ workingTime.end }}</td>
        <RouterLink :to="`/app/workingtime/${user.id}/${workingTime.id}`">See</RouterLink>
    </tr>
    </tbody>
  </table>

</div>
<div v-else>No Working Times Yet
</div>
</template>

<style scoped>
h3 {
  margin: 10px;

}

button {
  margin: 10px;
  padding: 10px;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

}
.clockIn {
  background-color: #4CAF50;
}
  .clockOut {
    background-color: #f44336;
  }

</style>