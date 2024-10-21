
<script setup lang="ts">
import { ref, onBeforeMount, computed } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import Form from '@/components/Form.vue'
import WorkingTimes from '@/components/WorkingTimes.vue';
import ChartManager from '@/components/ChartManager.vue';
import type { User, WorkingTime } from '@/types/crudTypes'
import { useApi } from '@/api';
import { store } from '@/api/store';

const user = ref<User | null>(null)
const route = useRoute()
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
                email: '',
                password: '',
                role: 'user',
            }
            return
        }
        user.value = await store.user;
        console.log('Stored User:', user.value)
        if (user.value) {
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
        <div class="flexWrapper">
            <div class="formUser">
            <h2>{{mode === 'create' ? 'Create User' : 'TON PROFIL'}} </h2>
            <Form context="user" :user="user" :mode="mode" @submit="action" />
            </div>  
        </div>
        <button @click="$router.back()">Go Back</button>
    </div>
    <div v-else>
        <h2>Tu n'est pas un utilisateur de Gottham.</h2>
        <button @click="$router.back()">Go Back</button>
    </div>
</template>


<style scoped >
.UserView {

}

h2 {
    text-transform: uppercase;
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 20px;
}

.flexWrapper {
    color: white;
    padding: 30px 50px;
    margin: auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 50%;
    padding: ;
    border-color: red 1px solid;
    background-color: #353535;
}

.formUser {
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