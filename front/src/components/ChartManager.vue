<script setup lang="ts">
import { onBeforeMount, ref, watchEffect } from 'vue';
import { computed } from 'vue';
import { Bar, Pie, Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale,ArcElement, PointElement } from 'chart.js';
import { CalendarDaysIcon } from '@heroicons/vue/24/solid'
import moment from 'moment';
import type { WorkingTime } from '@/types/crudTypes';


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
    if (chosenWorkingTimes.value.length < chosenTimelapsed.value) {
        const lastWorkingTime = moment(chosenWorkingTimes.value[chosenWorkingTimes.value.length - 1].start);
        for (let i = chosenWorkingTimes.value.length; i < chosenTimelapsed.value; i++) {
            newLabels.unshift(lastWorkingTime.subtract(1, 'days').format('dddd, D'));
        }
    }
    chosenWorkingTimes.value
        .map(workingTime => {
            const start = moment(workingTime.start);
            newLabels.push(start.format('dddd, D'));
        });
    
    return newLabels;
});

const durations = computed(() => {
    const shiftedWorkingTimes = chosenWorkingTimes.value.slice(1).concat(chosenWorkingTimes.value.slice(0, 1));
    const durationValues = shiftedWorkingTimes.map((workingTime: WorkingTime) => {
        const start = moment(workingTime.start);
        const end = moment(workingTime.end);
        return end.diff(start, 'seconds');
    });

    // Fill durations with '0' values if there is a difference in length
    while (durationValues.length < labels.value.length) {
        durationValues.unshift(0);
    }

    return durationValues;
});

const colors = computed(() => {
    return labels.value.map(() => {
        return '#'+(Math.random()*0xFFFFFF<<0).toString(16);
    });
});

const chartData = computed(() => ({
    labels: labels.value,
    datasets: [{
        label: 'Seconds',
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
</script>

<template>
    <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'>
    <div class="ChartManagerWrapper">
        <div class="chartControls">
            <div class="chartleft">
                <div class="chartTitle">
                    <h2>TIME TRACKER</h2>
                </div>
                <p>
                    <strong>Again ?</strong> Choisi un utilisateur parmis la liste suivante afin de tracker ses temps
                </p>
            </div>
            <div class="chartright">
                <div class="chartSelector">
                    <select v-model="graphMode">
                        <option value="bar">Bar</option>
                        <option value="doughnut">Doughnut</option>
                        <option value="pie">Pie</option>
                    </select> 
                </div>
                <div class="daysSelector">
                    <label for="days">Days:</label>
                    <input type="number" id="days" v-model="chosenTimelapsed" min="1" max="30" />
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