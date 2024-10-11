<script setup lang="ts">
import { onBeforeMount, ref, watchEffect } from 'vue';
import { computed } from 'vue';
import { Bar, Pie, Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale,ArcElement, PointElement } from 'chart.js';

import type { WorkingTime } from '@/types/crudTypes';


interface Props {
    workingTimes: WorkingTime[],
    graphMode: string;
}


const props = defineProps<Props>();

const graphMode = computed(() => props.graphMode);
console.log("graphMode", graphMode);

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
            labels.value.push(start.format('DD/MM/YYYY'));
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
    } else if (graphMode.value === 'bubble') {
        return {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    beginAtZero: true,
                },
                y: {
                    beginAtZero: true
                }
            }
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
    if (props.graphMode === 'bar') {
        ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
    } else if (props.graphMode === 'pie') {
        ChartJS.register(ArcElement, Tooltip, Legend)
    } else if (props.graphMode === 'doughnut') {
        ChartJS.register(ArcElement, Tooltip, Legend)    }
});
</script>

<template>
    <div class="ChartManager">
        <Bar v-if="graphMode === 'bar'" :data="chartData" :options="chartOptions" />
        <Pie v-if="graphMode === 'pie'" :data="chartData" :options="chartOptions" />
        <Doughnut v-if="graphMode === 'doughnut'" :data="chartData" :options="chartOptions" />
    </div>

</template>
