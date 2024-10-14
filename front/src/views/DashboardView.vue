<script setup lang="ts">
import { ref } from 'vue';
import type { User, WorkingTime } from '@/types/crudTypes';

import ChartManager from '@/components/ChartManager.vue';
import { onBeforeMount } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import {useApi} from '@/api/index';

const route = useRoute();
const api = useApi();
const workingTimes = ref<WorkingTime[] | null>(null);

const user = ref<User | null>(null);
const working = ref(false);

onBeforeMount (async () => {
    try {
        user.value = await api.getUser(1);
        if (user.value) {
            console.log("User:", user.value);
        
            const response = await api.getWorkingTimes(user.value);
            if (response) {
                console.log("Working times:", response);
                workingTimes.value = response;
            }
        }
    } catch (e) {
        console.log("Error fetching workingTimes:", e)
    }
})

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
    justify-content: center;
}

.block {
    flex:1;
}

.block-one {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.flex-item {
    flex: 1;

    padding: 20px;
    text-align: center;
 
}

.block-two {
    background-color: #d0d0d0;
    padding: 20px;
    text-align: center;
    border: 1px solid #bbb;
    border-radius: 4px;
    margin-bottom: 20px;
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
