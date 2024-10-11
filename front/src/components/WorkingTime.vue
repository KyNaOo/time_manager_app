<script setup lang="ts">
import { ref } from 'vue';

interface WorkingTime {
  id?: number ;
  start: string;
  end: string;
}

interface Props {
    workingTime: WorkingTime ;
}

const props = defineProps<Props>();


const workingTime = ref<WorkingTime | null>(null)
</script>


<template>
    <div class="workingtime-view" v-if="workingTime" >
        <h1>Working Time {{workingTime.id}}</h1>
        <p>Start: {{workingTime.start}}</p>
        <p>End: {{workingTime.end}}</p>
    </div>
    <div v-else>
        <p>WorkingTime not found</p>
    </div>
 
</template>


<style scoped>
.user-view {
    padding: 20px;
}
</style>