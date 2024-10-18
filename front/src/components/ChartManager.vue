<script setup lang="ts">
import { onBeforeMount, ref, watchEffect } from 'vue';
import { computed } from 'vue';
import { Bar, Pie, Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale,ArcElement, PointElement } from 'chart.js';
import { CalendarDaysIcon } from '@heroicons/vue/24/solid'
import moment from 'moment';
import type { WorkingTime } from '@/types/crudTypes';
import { cp } from 'fs';


interface Props {
    workingTimes: WorkingTime[],
}

const props = defineProps<Props>();
const graphMode = ref('bar');
const chosenTimelapsed = ref(props.workingTimes.length > 5 ? 5 : props.workingTimes.length);
console.log('Chosen timeElapsed:', chosenTimelapsed.value)

console.log('All Working times:', props.workingTimes)
const chosenWorkingTimes = computed(() => 
    props.workingTimes.length < chosenTimelapsed.value 
        ? props.workingTimes.slice(-chosenTimelapsed.value) 
        : props.workingTimes
);

console.log('Chosen working times:', chosenWorkingTimes.value)


const labels = computed(() => {
    const newLabels :any = [];
    chosenWorkingTimes.value
        .map(workingTime => {
            const start = moment(workingTime.start);
            newLabels.push(start.format('dddd, D'));
        });
    return newLabels;
});

const durations = computed(() => {
    return chosenWorkingTimes.value.map((workingTime: WorkingTime) => {
        const start = moment(workingTime.start);
        const end = moment(workingTime.end);
        return end.diff(start, 'seconds');
    });
});

const colors = computed(() => {
    return chosenWorkingTimes.value.map((workingTime: WorkingTime) => {
        return '#'+(Math.random()*0xFFFFFF<<0).toString(16);
    });
});

const chartData = computed(() => ({
    labels: labels.value,
    datasets: [{
        data: durations.value,
        backgroundColor: colors.value,
    }],
}));

console.log('Chart data:', chartData.value)

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
                <h2>Your last {{chosenTimelapsed}} days</h2>
                <CalendarDaysIcon class="icon" />
            </div>
            <div class="daysSelector">
                <label for="days">Days:</label>
                <input type="number" id="days" v-model="chosenTimelapsed" min="1" max="30" />
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