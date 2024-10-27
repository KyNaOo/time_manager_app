<script setup lang="ts">
import { toRefs, defineProps, onBeforeMount } from 'vue';
import { useApi } from '@/api';
import moment from 'moment';
import { ref } from 'vue';
import type { Modal } from '@/types/crudTypes';
import ModalAction from './modals/ModalAction.vue';
import { store } from '@/api/store';
import { computed } from 'vue';
import type { User } from '@/types/crudTypes';

const api = useApi();

const idToDelete = ref(0)

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
        default: true
    }
});

const modal = ref<Modal>({
    isVisible: false,
    title: '',
    message: ''
});

const { tableHeaders, tableData } = toRefs(props);



const currentUser = ref<User | null>(null);

const isUserAdmin = computed(() => {
return currentUser.value?.role === 'admin';
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
        store.showModal({message: `${props.tableType} with Id: ${id}, has been successfully deleted `, title: 'Success'});

        } catch (error) {
            console.error('Failed to delete item:', error);
    }
};

async function handleDelete (id : number)  {
    console.log(`Delete row`);
    idToDelete.value = id;
    modal.value = {
        isVisible: true,
        title: `${props.tableType.charAt(0).toUpperCase() + props.tableType.slice(1)} deletion?`,
        message: `Are you sure you want to delete this ${props.tableType}= ${id} ?`
    };
};


function formatDate(date: Date) {
    return moment(date).format('MMMM Do YYYY, h:mm:ss a')
}


onBeforeMount(async () => {
    try {
        currentUser.value = await store.user;
    } catch (error) {
        console.error('Error fetching user data:', error)
    }
})

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
                    <td class="actionCell">
                        <RouterLink v-if="tableType === 'workingtime'" :to="`/app/${tableType}/${tableData[0].user_id}/${tableData[rowIndex].id}`">See</RouterLink>
                        <RouterLink v-else-if="tableType === 'user'" :to="`/app/${tableType}/${tableData[rowIndex].id}`">See</RouterLink>
                        <RouterLink v-else-if="tableType === 'team'" :to="`/app/${tableType}/${tableData[rowIndex].id}`">See</RouterLink>
                        <!-- Add your action buttons or elements here -->
                        <button v-if="isUserAdmin" class="deleteBtn" @click="handleDelete(tableData[rowIndex].id)">Delete</button>
                        <ModalAction v-if="modal.isVisible" :title=modal.title :message="modal.message" 
                        @confirm="reallyDelete(idToDelete)" @close="modal.isVisible = false" />
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
    background-color: transparent;
    border: none;
    font-size: 14px;
    color: rgb(148, 148, 148);
    width: 40px;
    text-decoration: underline;
}

a:hover {
    transition: 0.8s;
    cursor: pointer;
    text-decoration: none;
}

th, td {
    border: 1px solid #ddd;
    padding: 8px;
}

th {
    background-color: #b6b6b6;
    text-align:left;
}

thead tr {
    text-transform: uppercase;
    font-weight: bold;
}

button {
    text-decoration: none;
    transition: 0.8s;
    color: rgb(148, 148, 148);
    background-color: transparent;
    border-radius: 25px;
    border: none;
    text-align: center;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 14px;    
    text-decoration: underline;
}

button:hover {
    transition: 0.8s;
    cursor: pointer;
    text-decoration: none;
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
