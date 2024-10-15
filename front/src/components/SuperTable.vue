<script setup lang="ts">
import { toRefs, defineProps } from 'vue';

const props = defineProps({
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


const handleDelete = (rowIndex: number) => {
    console.log(`Delete row at index: ${rowIndex}`);
    // Add your delete logic here
};

const handleSee = (rowIndex: number) => {
    console.log(`See row at index: ${rowIndex}`);
    // Add your see logic here
};

const { tableHeaders, tableData } = toRefs(props);

console.log(tableHeaders.value, tableData.value[0]);   
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
                    <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
                    <td v-if="showActions" class="actionCell">
                        <RouterLink :to="`/app/workingtime/${tableData[0].user_id}/${tableData[rowIndex].id}`">See</RouterLink>
                        <!-- Add your action buttons or elements here -->
                        <button class="deleteBtn" @click="handleDelete(rowIndex)">Delete</button>
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
