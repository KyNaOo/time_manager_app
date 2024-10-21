<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router'
import axios from 'axios'
import type {User, WorkingTime} from '@/types/crudTypes'

import { useApi } from '@/api';

const api = useApi();  
const route = useRoute()
const workingTimeId = ref(route.params.id ? String(route.params.id) : null);
const userId = ref(route.params.userId);
const workingTime = ref<WorkingTime | null>(null)

onBeforeMount(async () => {
    try {
        workingTime.value = await api.getWorkingTime(Number(userId.value), Number(workingTimeId.value));
    } catch (e) {
        console.log("Error fetching working time:", e);
    }
});
</script>


<template>
    <div class="workingtime-view" v-if="workingTime" >
        <button @click="$router.back()">Go Back</button>
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