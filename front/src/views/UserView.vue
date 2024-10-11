
<script setup lang="ts">
import { ref, onBeforeMount, computed } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import Form from '@/components/Form.vue'
import WorkingTimes from '@/components/WorkingTimes.vue';
import ChartManager from '@/components/ChartManager.vue';
import type { User, WorkingTime } from '@/types/crudTypes'

const user = ref<User | null>(null)
const route = useRoute()
const userId = ref(route.params.id);
const workingTimes = ref<WorkingTime[] | null>(null);
const graphMode = ref('bar');
const mode = computed(() => route.query.create ? 'create' : 'edition');

const modifyUser = async() => {
try {
    console.log(`Modify user with ID:`, userId.value);
    const resp = await axios.put(`http://localhost:4000/api/users/${userId.value}`, {
        user: {
            username: user.value?.username,
            email: user.value?.email
        }
    });
    console.log(`Modified user with ID: ${userId.value}`);
    // Add your logic to handle the response here
} catch (e) {
    console.log(`Error modifying user with ID: ${userId.value}`, e);
}
};

const createUser = async() => {
try {
    console.log(`Create user`);
    const resp = await axios.post(`http://localhost:4000/api/users`, {
        user: {
            username: user.value?.username,
            email: user.value?.email
        }
    });
    console.log(`Created user : ${resp.data.data}`);
    // Add your logic to handle the response here
} catch (e) {
    console.log(`Error creating user: ${userId.value}`, e);
}
};



const action = async() => {
if (mode.value === 'create') {
    await createUser()
} else {
    await modifyUser()
}
};


async function getWorkingTimes(user : User) {
    try {
        // get all working times from user
        const res =  await axios.get(`http://localhost:4000/api/workingtime/${user.id}`);
        return res.data.data;
    } catch (e) {
        console.log("Error fetching working times:", e);
    }
}

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
            workingTimes.value = await getWorkingTimes(user.value);
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
            <select v-model="graphMode">
                <option value="bar">Bar</option>
                <option value="doughnut">Doughnut</option>
                <option value="pie">Pie</option>
            </select> 
        <ChartManager v-if="workingTimes" :workingTimes="workingTimes" :graphMode="graphMode" />
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