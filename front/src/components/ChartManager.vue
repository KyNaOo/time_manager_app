<script setup lang="ts">
import { onBeforeMount, ref, watchEffect, watch} from 'vue';
import { computed } from 'vue';
import { Bar, Pie, Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale,ArcElement, PointElement } from 'chart.js';
import { CalendarDaysIcon } from '@heroicons/vue/24/solid'
import moment from 'moment';
import type { WorkingTime } from '@/types/crudTypes';
import { usefulFunctions } from '@/api/useful';

const useful = usefulFunctions();  
interface Props {
    workingTimes: WorkingTime[],
}

const props = defineProps<Props>();
const graphMode = ref('bar');
const filterBy = ref<string>('week');
const totalWorkingTimes = ref<any[]>([]);



const chosenTimelapsed = computed(() => {
    const value = filterBy.value === 'day' ? 1 : filterBy.value === 'week' ? 7 : filterBy.value === 'month' ? 30 : 365;
    console.log('Chosen timelapsed:', value);
    return value;
});


const chosenWorkingTimes = computed(() => 
totalWorkingTimes.value.length < chosenTimelapsed.value 
        ? props.workingTimes.slice(-chosenTimelapsed.value) 
        : totalWorkingTimes.value
);

console.log('Chosen working times:', chosenWorkingTimes.value);


const labels = computed(() => {
    const newLabels :any = [];
    // Get todays date and add add the number of chosenTimelapsed days passed
    const today = moment();
    if (chosenTimelapsed.value === 1) {
        newLabels.push(today.format('dddd, D'));
        return newLabels;
    }
    for (let i = 0; i < chosenTimelapsed.value; i++) {
        const date = today.subtract(1, 'days').format('dddd, D');
        newLabels.unshift(date);
    }
    newLabels.push(moment().format('dddd, D')); // Add today
    console.log('Labels:', newLabels);

    return newLabels;
});

const durations = computed(() => {
    const durationMap: { [key: string]: number } = {};
    totalWorkingTimes.value.forEach((workingTime: any) => {
        console.log('Working time in loop:', workingTime);  
        const date = moment(workingTime.date).format('dddd, D');
        console.log('Start Date from workig time:', date);
        if (workingTime.totalWorkingTime !== undefined) {
            durationMap[date] = workingTime.totalWorkingTime;
            console.log('Duration map:', durationMap);
        }
    });
    return labels.value.map((label: string | number) => durationMap[label] || 0);
});

onBeforeMount(async () => {
    totalWorkingTimes.value = await useful.calculateWorkingTime(chosenWorkingTimes.value);
});

const colors = computed(() => {
    return labels.value.map(() => {
        return '#'+(Math.random()*0xFFFFFF<<0).toString(16);
    });
});

const chartData = computed(() => ({
    labels: labels.value,
    datasets: [{
        label: 'Total Seconds',
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
                    ticks: {
                        color: 'white', 
                    },
                    grid: {
                        display: false,
                    },
                    border: {
                        color: 'white', 
                    }
                },
                y: {
                    stacked: true,
                    ticks: {
                        color: 'white', 
                    },
                    grid: {
                        display: false, 
                    },
                    border: {
                        color: 'white', 
                    }
                }
            },
        };
    } else if (graphMode.value === 'pie') {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: 'white', 
                    }
                }
            }
        };
    } else if (graphMode.value === 'doughnut') {
        return {
            responsive: true,
            maintainAspectRatio: false,
            cutoutPercentage: 50,
            plugins: {
                legend: {
                    labels: {
                        color: 'white', 
                    }
                }
            }
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


watch(filterBy, (newValue, oldValue) => {
    console.log(`filterBy changed from ${oldValue} to ${newValue}`);
    console.log('Chosen timelapsed:', chosenTimelapsed.value);
});

</script>

<template>
    <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'>
    <div class="ChartManagerWrapper">
        <div class="chartControls">
            <div class="chartleft">
                <div class="chartTitle">
                    <h2>TIME TRACKER</h2>
                </div>
            </div>
            <div class="chartright">
                <div class="chartSelector">
                    <label for="graphMode">Graph mode:</label>
                    <select v-model="graphMode">
                        <option value="bar">Bar</option>
                        <option value="doughnut">Doughnut</option>
                        <option value="pie">Pie</option>
                    </select> 
                </div>
                <div class="filterSelector">
                    <label for="filterBy">Filter by:</label>
                    <select id="filterBy" v-model="filterBy">
                        <option value="day">Day</option>
                        <option value="week">Week</option>
                        <option value="month">Month</option>
                    </select>
                </div>
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
    font-family: 'Poppins';
    display: flex;
    flex-direction: column;
    gap: 20px;
    color: white;
    background-color: #353535;
    padding: 30px 60px;
    border-radius: 10px;
    
}
strong {
    color: black;
    font-weight: bold;
}
p {
    font-size: 18px;
    font-weight: lighter;
}
.chartTitle {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: bold;
    margin-bottom: 10px;
    font-size: 22px;
}
.chartControls {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 25px;
}
.chartleft{
    width: 60%;
}
.chartright {
    margin-top: 15px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 20px;

}
.daysSelector {
    width: 20px;
}
.chartSelector {
    margin-bottom: 5px;
}
select{
    padding: 5px;
    border-radius: 5px;
    /* border: 1px solid #ccc; */
    cursor: pointer ;
    width: 80px;
}

.icon {
    width: 30px;
}
</style>