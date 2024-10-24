
<script setup lang="ts">
import { ref, onBeforeMount, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Form from '@/components/Form.vue'
import type { User,Team, WorkingTime } from '@/types/crudTypes'
import { useApi } from '@/api';
import { store } from '@/api/store';
import SuperTable from '@/components/SuperTable.vue';

const route = useRoute();
const user = ref<User | null>(null);
const teams = ref<Team[] | null>(null);
const team = ref<Team | null>(null)
const teamId = route.params.id ? String(route.params.id) : undefined;
console.log('Team ID:', teamId)
const mode = computed(() => route.query.create ? 'create' : 'edition');
const api = useApi();
const currentUser = ref<User | null>(null);
const router = useRouter();
const users = ref<User[] | null>(null);
const teamMembers = ref<TeamMember[]>([]); 
const allUsersInTeam = ref<User[] | null>(null)

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

onBeforeMount(async () => {
    try {
        users.value = await api.getAllUsers();
        teams.value = await api.getTeams();
        allUsersInTeam.value = await api.getUserInTeam(team.value as Team);
        if (!teams.value) {
            teams.value = [];
        }
        console.log("teams:", teams.value)
    } catch (e) {
        console.log("Error fetching teams:", e)
    }
})

const formData = ref({
    userId: '',
    teamId: '',
    isTeamLeader : false,
});

const addUserInTeams = async() => {
    try {
        await api.addUserToTeam(Number(formData.value.userId), Number(team.value?.id), formData.value.isTeamLeader);
        store.showModal({message: "User add successfully", title: 'Success'});
        //allUsersInTeam.value = await api.getUserInTeam(team.value as Team);

    }
    catch(e:any) {
        store.showModal({message: e.response.data.error, title: 'Error'});
    }
}

const userisAdmin = computed( () => {
  return user.value?.role === 'admin';
});

const tableHeaders = computed(() => {
  const headers = user.value ? Object.keys(user.value) : ['ID', 'Username', 'Is Manager'];
  if (userisAdmin.value) {
    headers.push('Actions');
  }
  return headers;
});

export interface TeamMember {
    userId: number;
    teamId: number;
    isTeamLeader: boolean; 
}

console.log("eheeh", formData)
</script>

<template>
    <div class="TeamView" v-if="currentUser">
        <div class="flexWrapper">
            <div class="formUser">
            <h2>{{mode === 'create' ? 'Créer une équipe' : 'Modifier ton équipe'}} </h2>
            <Form v-if="team" :context="'team'" :team="team" :mode="mode" @submit="action" />
            </div>
        </div>
    </div>
    <div v-else>
        <p>Team not found</p>
    </div>

    <div v-if="mode !== 'create'" class="teamArray">
        <h2 class="titleArray">ton équipe</h2>
        <SuperTable class="arrayTeam" v-if="allUsersInTeam" :tableData="allUsersInTeam" tableType="user" :tableHeaders="tableHeaders" :showActions="userisAdmin"/>
    </div>

    <div v-if="mode !== 'create'" class="teams">
        <div class="usersTitle">
            <h2>Ajoute un membre à une team</h2>
        </div>
        
        <form @submit.prevent="addUserInTeams()">
            <div class="form-group">
                <label for="userSelect">Choisir un utilisateur:</label>
                <select id="userSelect" v-model="formData.userId">
                    <option v-for="user in users" :key="user.id" :value="user.id">{{ user.username }}</option>
                </select>
            </div>
            <div class="form-group">
                <label for="managerSelect">Est-il manager :</label>
                <select id="managerSelect" v-model="formData.isTeamLeader">
                    <option :value="true">Oui</option>
                    <option :value="false">Non</option>
                </select>
            </div>
            <button type="submit" class="add-button">Ajouter</button>
        </form>
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

form {
    display: flex;
    flex-direction: column;
    font-size: 18px;
    gap: 20px;
}
.form-group {
    display: flex;
    color: white;
    justify-content: space-between;
}

select {
    width: 100px;
    height: 30px;
    font-weight: lighter;
    text-transform: uppercase;
}

.titleArray {
    text-transform: uppercase;
    font-weight: bold;
    font-size: 22px;
}

.teamArray {
    width: 40%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 40px;
    margin-bottom: 40px;
}

button {
    padding: 10px 24px;
    font-weight: bold;
    text-transform: uppercase;
    transition: 0.4s;
    background-color: #FFCC26;
    color: white;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    width: fit-content;
    font-size: 14px;
}


button:hover {
    cursor: pointer;
    transition: 0.4s;
    background-color: #9a790e;
}

.teams {
    background-color: #353535;
    padding: 30px 60px;
    border-radius: 10px;
}

.teams h1 {
    font-size: 24px;
    margin-bottom: 10px;
}

.teams h2 {
    text-transform: uppercase;
    font-size: 28px;
    font-weight: bold;
    color: white;
}
</style>