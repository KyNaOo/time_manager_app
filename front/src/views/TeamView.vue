
<script setup lang="ts">
import { ref, onBeforeMount, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Form from '@/components/Form.vue'
import type { User,Team, WorkingTime } from '@/types/crudTypes'
import { useApi } from '@/api';
import { store } from '@/api/store';

const route = useRoute();
const team = ref<Team | null>(null)
const teamId = route.query.id ? String(route.query.id) : undefined;
const mode = computed(() => route.query.create ? 'create' : 'edition');
const api = useApi();
const currentUser = ref<User | null>(null);
const router = useRouter();

const action = async() => {
    if (team.value === null) {
        console.error('Team is null')
        return
    }
    if (mode.value === 'create') {
        if (currentUser.value && currentUser.value.id !== undefined) {
            const newTeam = await api.createTeam(team.value.name, currentUser.value.id)
            console.log('Team created', newTeam)
        } else {
            console.error('Current user or user ID is null or undefined')
        }
        // redirect to teams view
        // router.push('/app/teams')
    } else {
        if (teamId !== undefined && currentUser.value && currentUser.value.id !== undefined) {
            await api.modifyTeam(Number(teamId), team.value.name, currentUser.value!.id);
        } else {
            console.error('Team ID is undefined');
        }
    }
};


onBeforeMount(async () => {
    try {
        currentUser.value = await store.user;
        console.log('Full Route :', route)
        if (mode.value === 'create') {
            team.value = {
                name: '',
            }
            return
        }
        
        console.log('Stored User:', currentUser.value)
      
    } catch (error) {
        console.error('Error fetching user data:', error)
    }
})
</script>

<template>
    <div class="TeamView" v-if="currentUser">
        <button @click="$router.back()">Go Back</button>
        <div class="flexWrapper">
            <div class="formUser">
            <h2>{{mode === 'create' ? 'Create Team' : 'Edit Team'}} </h2>
            <Form v-if="team" :context="'team'" :team="team" :mode="mode" @submit="action" />
            </div>
        </div>
    </div>
    <div v-else>
        <p>Team not found</p>
        <button @click="$router.back()">Go Back</button>
    </div>
</template>


<style scoped >
.TeamView {
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