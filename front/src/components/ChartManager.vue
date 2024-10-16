<script setup lang="ts">
import { onBeforeMount, ref, watchEffect } from 'vue';
import { computed } from 'vue';
import { Bar, Pie, Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale,ArcElement, PointElement } from 'chart.js';
import { CalendarDaysIcon } from '@heroicons/vue/24/solid'

import type { WorkingTime } from '@/types/crudTypes';


interface Props {
    workingTimes: WorkingTime[],
}


const props = defineProps<Props>();

const graphMode = ref('bar');

const labels :any= ref([])
const durations :any = ref([])

console.log("props", props.workingTimes);

const lastFiveWorkingTimes = getLastFiveWorkingTimes(props.workingTimes);

import moment from 'moment';

function getLastFiveWorkingTimes(workingTimes: WorkingTime[]) {
    return workingTimes.slice(-5);
}


function getWorkingTimesDuration(lastFiveWorkingTimes: WorkingTime[]) {

    lastFiveWorkingTimes
        .map(workingTime => {
            const start = moment(workingTime.start);
            const end = moment(workingTime.end);
            const duration = end.diff(start, 'seconds');
            labels.value.push(start.format('dddd, D'));
            durations.value.push(duration) ;
        });

    return durations;
}

const chartData = ref ({
        labels: labels.value,
        datasets: [ { 
            data: durations.value,
            backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16', '#FFCE56'],
         } ],

      },)

const chartOptions = computed(() => {
    if (graphMode.value === 'bar') {
        return {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true
                }
            }
        };
    } else if (graphMode.value === 'pie') {
        return {
            responsive: true,
            maintainAspectRatio: false,
        };
    } else if (graphMode.value === 'doughnut') {
        return {
            responsive: true,
            maintainAspectRatio: false,
            cutoutPercentage: 50,
        };
    }
    return {};
});

onBeforeMount(() => {
    getWorkingTimesDuration(lastFiveWorkingTimes);

});

watchEffect(() => {
    if (graphMode.value === 'bar') {
        ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
    } else if (graphMode.value  === 'pie') {
        ChartJS.register(ArcElement, Tooltip, Legend)
    } else if (graphMode.value  === 'doughnut') {
        ChartJS.register(ArcElement, Tooltip, Legend)    }
});
</script>

<template>
    <div class="ChartManagerWrapper">
        <div class="chartControls">
            <div class="chartTitle">
                <h2>Your last 5 days</h2>
                <CalendarDaysIcon class="icon" />
            </div>
            
            <div class="chartSelector">
                <select v-model="graphMode">
                    <option value="bar">Bar</option>
                    <option value="doughnut">Doughnut</option>
                    <option value="pie">Pie</option>
                </select> 
            </div>
        </div>
    <div class="ChartManager">
        <Bar v-if="graphMode === 'bar'" :data="chartData" :options="chartOptions" />
        <Pie v-if="graphMode === 'pie'" :data="chartData" :options="chartOptions" />
        <Doughnut v-if="graphMode === 'doughnut'" :data="chartData" :options="chartOptions" />
    </div>
    </div>


</template>

<style scoped>
.ChartManagerWrapper {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.chartTitle {
    display: flex;
    align-items: center;
    gap: 10px;
}
.chartControls {
    display: flex;
    justify-content: space-between;
}
select{
    padding: 10px;
    border-radius: 5px;
    /* border: 1px solid #ccc; */
    cursor: pointer ;
    width: 100px;
}
.icon {
    width: 30px;
}
</style>