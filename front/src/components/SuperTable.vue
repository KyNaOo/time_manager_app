<script setup lang="ts">
import { toRefs, defineProps } from 'vue';
import { useApi } from '@/api';
import moment from 'moment';
const api = useApi();

const props = defineProps({
    tableType: {
        type: String,
        required: true
    },
    tableHeaders: {
        type: Array as () => (string | number)[],
        required: true
    },
    tableData: {
        type: Array as () => (any)[],
        required: true
    },
    showActions: {
        type: Boolean,
        default: false
    }
});


const handleDelete = async (id: number) => {
    console.log(`Delete row at index: ${id}`);
    const deleteResult = await api.deleteWorkingTime(id);
    if (deleteResult) {
        window.location.reload();
    }
    // Add your delete logic here
};

const handleSee = (rowIndex: number) => {
    console.log(`See row at index: ${rowIndex}`);
    // Add your see logic here
};

const { tableHeaders, tableData } = toRefs(props);

console.log(tableHeaders.value, tableData.value[0]);   

function formatDate(date: Date) {
    return moment(date).format('MMMM Do YYYY, h:mm:ss a')
}
</script>


<template>
    <div>
        <table>
            <thead>
                <tr>
                    <th v-for="header in tableHeaders" :key="header">{{ header }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(row, rowIndex) in tableData" :key="rowIndex">
                    <td v-for="(cell, cellIndex) in row" :key="cellIndex">
                        {{ cell instanceof Date ? formatDate(cell): cell }}
                    </td>
                    <td v-if="showActions" class="actionCell">
                        <RouterLink :to="`/app/${tableType}/${tableData[0].user_id}/${tableData[rowIndex].id}`">See</RouterLink>
                        <!-- Add your action buttons or elements here -->
                        <button class="deleteBtn" @click="handleDelete(tableData[rowIndex].id)">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>



<style scoped>
table {
    width: 100%;
    border-collapse: collapse;
}

th, td {
    border: 1px solid #ddd;
    padding: 8px;
}

th {
    background-color: #f2f2f2;
    text-align:left;
}

button {
    padding: 5px 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.actionCell {
    display: flex;
    gap: 5px;
}

.seeBtn {
    background-color: #007bff;
    color: white;
}
.deleteBtn {
    background-color: #dc3545;
    color: white;
}
</style>
