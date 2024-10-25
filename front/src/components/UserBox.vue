 
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


const props = defineProps<{
    user?: User | null;
}>();

const action = async() => {
    if (user.value === null) {
        console.error('User is null')
        return
    }
    if (mode.value === 'create') {
        await api.createUser(user.value)
    }
    else {
        await api.deleteUser(Number(user.value.id))
        store.token=null;
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
        }else {
            user.value = props.user ? props.user : null;
        }
 
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
    <div class="UserBox" v-if="user">
        <div class="flexWrapper">
            <div class="formUser">
            <h2>{{mode === 'create' ? 'CREER UN UTILISATEUR' : 'PROFIL DE ' +  user.username  }} </h2>
            <Form context="user" :user="user" :mode="mode" @submit="action" />
            </div>  
        </div>

    </div>
    <div v-else>
        <h2>Tu n'es pas un utilisateur de Gottham.</h2>
    </div>
</template>


<style scoped >
.UserBox {
    margin: auto;
    width: 50%;
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
    width: 100%;
    padding: 23px 64px;
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