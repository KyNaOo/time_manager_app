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
        <h1>Working Time {{workingTime.id}}</h1>
        <p><u>Tu as commencé à:</u> {{ workingTime.start}}</p>
        <p><u>Et finis à:</u> {{ workingTime.end}}</p>
    </div>
    <div v-else>
        <p>WorkingTime not found</p>
    </div>
 
</template>


<style scoped>
.user-view {
    padding: 20px;
}

.workingtime-view {
    display: flex;
    flex-direction: column;
    width: 40%;
    background-color: #353535;
    color: white;
    border-radius: 15px;
    padding: 40px 60px;
}

h1 {
    font-weight: bold;
    font-size: 28px;
    text-transform: uppercase;
    margin-bottom: 20px;
}

p {
    font-weight: 300;
    font-size: 20px;
}
</style>