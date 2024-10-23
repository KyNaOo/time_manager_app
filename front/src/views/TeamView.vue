
<script setup lang="ts">
import { ref, onBeforeMount, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Form from '@/components/Form.vue'
import type { User,Team, WorkingTime } from '@/types/crudTypes'
import { useApi } from '@/api';
import { store } from '@/api/store';

const route = useRoute();
const team = ref<Team | null>(null)
const teamId = route.params.id ? String(route.params.id) : undefined;
console.log('Team ID:', teamId)
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
            const newTeam = await api.createTeam(team.value.title, currentUser.value.id)
            console.log('Team created', newTeam)
        } else {
            console.error('Current user or user ID is null or undefined')
        }
        // redirect to teams view
        store.showModal({message: 'Team created successfully', title: 'Success'});
    } else {
        if (teamId !== undefined && currentUser.value && currentUser.value.id !== undefined) {
            await api.modifyTeam(Number(teamId), team.value.title, currentUser.value!.id);
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
                title: '',
                is_team_leader: true
            }
            return
        }
        team.value = await api.getTeam(Number(teamId));

        console.log('Team:', team.value)
        
      
    } catch (error) {
        console.error('Error fetching user data:', error)
    }
})
</script>

<template>
    <div class="TeamView" v-if="currentUser">
        <div class="flexWrapper">
            <div class="formUser">
            <h2>{{mode === 'create' ? 'Créer une équipe' : 'Modifier ton équipe'}} </h2>
            <Form v-if="team" :context="'team'" :team="team" :mode="mode" @submit="action" />
            </div>
            <!-- <SuperTable :tableData="teams" tableType="team" :tableHeaders="tableHeaders" :showActions="userisAdmin"/> -->
        </div>
    </div>
    <div v-else>
        <p>Team not found</p>
    </div>
</template>


<style scoped >
.TeamView {
    width: 40%;
}

.flexWrapper {
    width: 50%;
    color: white;
    display: flex;
    flex-direction: row;
    background-color: #353535;
    border-radius: 15px;
    padding: 40px 80px;
    justify-content: space-between;
    width: 100%;
}

.formUser {
    margin-top: 20px;
    flex: 1;
}

h2 {
    text-transform: uppercase;
}
</style>