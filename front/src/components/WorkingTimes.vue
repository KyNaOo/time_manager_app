<script setup lang="ts">
import axios from "axios";
import {computed, onBeforeMount, ref} from "vue";
import moment from "moment";
import type { User,WorkingTime, Clock } from "@/types/crudTypes";
import { useApi } from "@/api";
import {usefulFunctions} from "@/api/useful";
import SuperTable from "./SuperTable.vue";
import { ClockIcon } from '@heroicons/vue/24/solid'

interface Props {
    user: User ;
    workingTimes: WorkingTime[];
}
const props = defineProps<Props>();

const workingTimes = ref<WorkingTime[] | null>(null);

const clocks = ref<Clock[] | null>(null);

const working = ref(false);

const api = useApi();

const useful = usefulFunctions();

const tableHeaders = computed(() => {
  const headers = ['ID', 'Start', 'End', 'User Id', 'Actions'];
  return headers;
});




onBeforeMount(async () => {
  try {
    workingTimes.value = props.workingTimes;
    
    if (workingTimes.value) {
      workingTimes.value = workingTimes.value.map(workingTime => ({
        ...workingTime,
        start: new Date(workingTime.start),
        end: new Date(workingTime.end)
        
      }));
    }
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
    <div class="WorkingTimes" v-if="workingTimes">
      <div class="workingTimesTitle">
        <h2>Toutes tes heures à veiller</h2>
      </div>
      <SuperTable :tableType="'workingtime'" :tableHeaders="tableHeaders" :tableData="workingTimes" :showActions="true" />
    </div>
    <div v-else>Commence à veiller !
  </div>
</template>

<style scoped>
h2 {
  text-transform: uppercase;
  font-size: 28px;
}

.WorkingTimes {
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.workingTimesTitle {
  display: flex;
  gap: 10px;
  align-items: center;
}


</style>