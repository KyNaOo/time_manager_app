
<script setup lang="ts">
import { ref, onBeforeMount, computed } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import Form from '@/components/Form.vue'
import WorkingTimes from '@/components/WorkingTimes.vue';
import ChartManager from '@/components/ChartManager.vue';
import type { User, WorkingTime } from '@/types/crudTypes'
import { useApi } from '@/api';

const user = ref<User | null>(null)
const route = useRoute()
const userId = ref(route.params.id);
const workingTimes = ref<WorkingTime[] | null>(null);
const mode = computed(() => route.query.create ? 'create' : 'edition');

const api = useApi();

const action = async() => {
    if (user.value === null) {
        console.error('User is null')
        return
    }
    if (mode.value === 'create') {
        await api.createUser(user.value)
    } else {
        await api.modifyUser(user.value)
    }
};


onBeforeMount(async () => {
    try {
        console.log('Full Route :', route)
        if (mode.value === 'create') {
            user.value = {
                username: '',
                email: ''
            }
            return
        }
        const response = await axios.get(`http://localhost:4000/api/users/${userId.value}`)
        console.log('User data:', response.data)
        user.value = response.data.data;
        if (user.value){
            workingTimes.value = await api.getWorkingTimes(user.value);
            console.log('User '+ user.value.username+' working times:', workingTimes.value)

        }
    } catch (error) {
        console.error('Error fetching user data:', error)
    }
})
</script>

<template>
    <div class="UserView" v-if="user">
        <button @click="$router.back()">Go Back</button>
        <div class="flexWrapper">
            <div class="formUser">
            <h2>{{mode === 'create' ? 'Create User' : 'Edit User'}} </h2>
            <Form :user="user" :mode="mode" @submit="action" />
            </div>
            <WorkingTimes v-if="mode === 'edition'" :user="user" />            
        </div>
        <div class="graphWrapper">

        <ChartManager v-if="workingTimes" :workingTimes="workingTimes"/>
        </div>

    </div>
    <div v-else>
        <p>User not found</p>
        <button @click="$router.back()">Go Back</button>
    </div>
</template>


<style scoped >
.UserView {
    padding: 20px;
    display: flex;
    flex-direction: column;
    width: 100%;
}

.flexWrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    gap: 20px;
    border-color: red 1px solid;
}

.formUser {
    margin-top: 20px;
    flex: 1;
}

button {
    margin-top: 20px;
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    width: fit-content;
}
</style>