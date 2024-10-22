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
            if (props.tableType === 'team') {
                await api.deleteTeam(id);
            } else if (props.tableType === 'user') {
                await api.deleteUser(id);
            } else if (props.tableType === 'workingtime') {
                await api.deleteWorkingTime(id);
            }
            store.showModal({message: 'Item deleted successfully', title: 'Success'});
        } catch (error) {
            console.error('Failed to delete item:', error);
        }
    };

const handleDelete = async () => {
    console.log(`Delete row`);
    modal.value = {
        isVisible: true,
        title: `${props.tableType.charAt(0).toUpperCase() + props.tableType.slice(1)} deletion?`,
        message: `Are you sure you want to delete this ${props.tableType}?`
    };
};

const { tableHeaders, tableData } = toRefs(props);

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
                        <RouterLink v-if="tableType === 'workingtime'" :to="`/app/${tableType}/${tableData[0].user_id}/${tableData[rowIndex].id}`">See</RouterLink>
                        <RouterLink v-else-if="tableType === 'user'" :to="`/app/${tableType}/${tableData[rowIndex].id}`">See</RouterLink>
                        <RouterLink v-else-if="tableType === 'team'" :to="`/app/${tableType}/${tableData[rowIndex].team_id}`">See</RouterLink>
                        <!-- Add your action buttons or elements here -->
                        <button class="deleteBtn" @click="handleDelete()">Delete</button>
                        <ModalAction v-if="modal.isVisible" :title=modal.title :message="modal.message" 
                        @confirm="reallyDelete(tableType === 'team' ? tableData[rowIndex].team_id :tableData[rowIndex].id)" @close="modal.isVisible = false" />
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

a {
    background-color: #000000;
    width: 60px;
    font-size: 12px;
}

a:hover {
    opacity: 0.6;
}

th, td {
    border: 1px solid #ddd;
    padding: 8px;
}

th {
    background-color: #b6b6b6;
    text-align:left;
}

tr {
    text-transform: uppercase;
    font-weight: bold;
}

button {
    text-decoration: none;
    transition: 0.4s;
    color: white;
    background-color: #cd1d1d;
    padding: 4px 8px;
    border: solid white 1px;
    border-radius: 25px;
    width: 80px;
    text-align: center;
    text-transform: uppercase;
    font-weight: bold;
    cursor: pointer;
    font-size: 12px;
}

button:hover {
    background-color: #731a23;
}

.actionCell {
    display: flex;
    justify-content: flex-end;
    gap: 5px;
}

.seeBtn {
    background-color: #007bff;
    color: white;
}
</style>
