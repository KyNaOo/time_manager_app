
<script setup lang="ts">
import { ref, onBeforeMount, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Form from '@/components/Form.vue'
import type { User,Team, WorkingTime } from '@/types/crudTypes'
import { useApi } from '@/api';
import { store } from '@/api/store';
import SuperTable from '@/components/SuperTable.vue';
import type { TeamMember } from '@/types/crudTypes';
import ChartManager from '@/components/ChartManager.vue';
import { usefulFunctions } from '@/api/useful';
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
const usersNotInTeam = ref<User[]>([]);
const tableHeaders = ref<string[]>(user.value ? Object.keys(user.value) : ['Username', 'Is Manager', 'ID', 'Actions']);

const workingTimes = ref<WorkingTime[] | null>(null);


const action = async(teamToChange : Team) => {
    if (team.value === null) {
        console.error('Team is null')
        return
    }
    if (mode.value === 'create') {
        if (currentUser.value && currentUser.value.id !== undefined) {
            const newTeam = await api.createTeam(team.value.title, currentUser.value.id);
            if (!newTeam) {
                store.showModal({message: "Errer lors de la création de l'équipe ", title: 'Error'});
                return
            }
            const leader =  await api.addTeamMember(currentUser.value.id, newTeam.id, true)
            console.log('Leader Added to team:', leader)
            router.push(`/app/team/${newTeam.id}`)
            store.showModal({message: 'Team created successfully', title: 'Success'});
        } else {
            console.error('Current user or user ID is null or undefined')
        }
    } else {
        if (teamId && currentUser.value && currentUser.value.id) {
            console.log('Team to change:', teamToChange)
            await api.modifyTeam(Number(teamId), teamToChange.title, currentUser.value!.id);
            store.showModal({message: 'Team updated successfully', title: 'Success'});
        } else {
            console.error('Team ID is undefined');
        }
    }
};

const isCurrentUserAdmin = computed(() => {
    return currentUser.value?.role === 'admin';
});

async function getTeamWorkingTimes(team: Team, teamMembers: TeamMember[]) {
    try {
        if (team && teamMembers) {
            return await api.getTeamWorkingTimes(team.id!, teamMembers);
        }
    } catch (error) {
        console.error('Error fetching team working times:', error);
        return null;
    }
}


onBeforeMount(async () => {
    try {
        currentUser.value = await store.user;
        if (mode.value === 'create') {
            team.value = {
                title: '',
                is_team_leader: true
            }
            return
        }       
        team.value = await api.getTeam(Number(teamId));
        users.value = await api.getAllUsers();
        console.log('ALL users', users.value)
        teams.value = await api.getTeams();
        if(team.value !== null) {
            if (team.value) {
                teamMembers.value = (await api.getTeamMembers(team.value as Team)) || [];
                // Add id key to object being displayed in the table
                teamMembers.value = teamMembers.value.map(member => ({...member, id: member.user_id}));
                // set table headers to match the team members object keys
                tableHeaders.value = teamMembers.value.length > 0 ? Object.keys(teamMembers.value[0]) : [];
                
                // add actions to the table headers
                tableHeaders.value.push('Actions');
                console.log('Team members:', teamMembers.value);
                workingTimes.value = await api.getTeamWorkingTimes(team.value.id!, teamMembers.value);
                console.log('Total working times:', workingTimes);
            }
            usersNotInTeam.value = users.value?.filter(user => !teamMembers.value.some(member => member.id === user.id));
            console.log('Users not in team:', usersNotInTeam.value)
        }else {
            teams.value = [];
        }
        
    } catch (error) {
        console.error('Error fetching user data:', error)
    }
})

const formData = ref({
    userId: '',
    teamId: '',
    isTeamLeader : false,
});

async function addUserInTeams()  {
    try {
        if (team.value === null) {
            console.error('Team is null')
            return
        }
        console.log('Add user in team:', formData.value) 
        await api.addTeamMember(Number(formData.value.userId), Number(team.value?.id), formData.value.isTeamLeader);
        store.showModal({message: "User add successfully", title: 'Success'});
        teamMembers.value = (await api.getTeamMembers(team.value)) || [];
        formData.value = {
            userId: '',
            teamId: '',
            isTeamLeader: false
        }
    }
    catch(e:any) {
        store.showModal({message: e.response.data.error, title: 'Error'});
    }
}

function deleteTeam() {
    if (team.value && teamId) {
        console.log('Delete team:', team.value)
        api.deleteTeam(Number(teamId));
        store.showModal({message: 'Team deleted successfully', title: 'Success'});
        router.push('/');
    } else {
        console.error('Team ID is undefined');
    }
}




</script>

<template>
    <div class="TeamView" v-if="team">
        <div class="flexWrapper">
            <div class="left">
                <div class="formWrapper">
            <div class="formUser" v-if="isCurrentUserAdmin">
                <h2>{{mode === 'create' ? 'Créer une équipe' : 'Modifies ton équipe'}} </h2>
                <Form  :context="'team'" :team="team" :mode="mode" @submit="action($event)" @delete="deleteTeam" />
            </div>  
            <div v-else>
                <h2>Équipe {{ team?.title }}</h2>
            </div>
        </div>

        <div v-if="mode !== 'create' && isCurrentUserAdmin" class="teamForm">
            <div class="usersTitle">
                <h2>Ajoute un membre à une team</h2>
            </div>
            
            <form v-if="usersNotInTeam.length > 0" @submit.prevent="addUserInTeams()">
                <div class="form-group">
                    <label for="userSelect">Choisir un utilisateur:</label>
                    <select id="userSelect" v-model="formData.userId">
                        <option v-for="user in usersNotInTeam" :key="user.id" :value="user.id">{{ user.username }}</option>
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
            <div v-else>
                <p>Il n'y a plus d'utilisateurs à ajouter.</p>
            </div>
        </div>
            </div>
            <div class="right">
                <div v-if="mode !== 'create'" class="teamArray">
                    <h2 >Membres de l'équipe</h2>
                    <SuperTable class="arrayTeam" v-if="teamMembers" :tableData="teamMembers" tableType="user" :tableHeaders="tableHeaders" showActions/>
                </div>
                <ChartManager  v-if="workingTimes" :workingTimes="workingTimes" />
            </div> 
        </div>
    </div>
    <div v-else>
        <p>Team not found</p>
    </div>


</template>


<style scoped >
.TeamView {
    width: 100%;
}

.flexWrapper {
    width: 50%;
    color: white;
    display: flex;
    flex-direction: row;
    background-color: #353535;
    border-radius: 15px;
    padding: 40px 80px;
    width: 100%;
    gap: 30px;
}
.left, .right {
    display: flex;
    flex-direction: column;
    gap: 20px;
    flex: 1;
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
    width: 100%;
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
    width: 100%;
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