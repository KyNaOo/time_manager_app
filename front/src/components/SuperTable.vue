<script setup lang="ts">
import { toRefs, defineProps } from 'vue';
import { useApi } from '@/api';
import moment from 'moment';
import { ref } from 'vue';
import type { Modal } from '@/types/crudTypes';
import ModalAction from './modals/ModalAction.vue';
import { store } from '@/api/store';

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

const modal = ref<Modal>({
    isVisible: false,
    title: '',
    message: ''
});

async function reallyDelete(id: number) {
        try {
            await api.deleteWorkingTime(id);
            store.showModal({message: 'Item deleted successfully', title: 'Success'});
        } catch (error) {
            console.error('Failed to delete item:', error);
        }
    };

const handleDelete = async () => {
    console.log(`Delete row`);``
    modal.value = {
        isVisible: true,
        title: 'User deletion?',
        message: 'Are you sure you want to delete this item?'
    };
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
                        <button class="deleteBtn" @click="handleDelete()">Delete</button>
                        <ModalAction v-if="modal.isVisible" :title=modal.title :message="modal.message" 
                        @confirm="reallyDelete(tableData[rowIndex].id)" @close="modal.isVisible = false" />
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
