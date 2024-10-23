<script setup lang="ts">
import SuperTable from '@/components/SuperTable.vue';
import { UserGroupIcon } from '@heroicons/vue/24/solid'
import { ref, onBeforeMount, computed } from 'vue';
import { store } from '@/api/store';
import type { Team,  User } from '@/types/crudTypes';
import instance from '@/api/axios';
import { useApi } from '@/api';

const api = useApi();
const users = ref<User[] | null>(null);
const user = ref<User | null>(null);
const teams = ref<Team[] | null>(null);

onBeforeMount(async () => {
    try {
        users.value = await api.getAllUsers();
        teams.value = await api.getTeams();
        // allUserInTeam.value = await api.getUserInTeam(Number(formData2.value.teamId))
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
    isTeamLeader : '',
});

const addUserInTeams = async() => {
    try {
        await api.addUserToTeam(Number(formData.value.userId), Number(formData.value.teamId), Boolean(formData.value.isTeamLeader));
        store.showModal({message: "User add successfully", title: 'Success'});
    }
    catch(e:any) {
        store.showModal({message: e.response.data.error, title: 'Error'});
    }
}
</script>


<template>
    <div class="teams">
        <div class="usersTitle">
            <h2>Ajoute un membre à une team</h2>
        </div>
        
        <form @submit.prevent="addUserInTeams()">
            <div class="form-group">
                <label for="userSelect">Choisir un utilisateur :</label>
                <select id="userSelect" v-model="formData.userId">
                    <option v-for="user in users" :key="user.id" :value="user.id">{{ user.username }}</option>
                </select>
            </div>
            <div class="form-group">
                <label for="managerSelect">Est-il manager :</label>
                <select id="managerSelect" v-model="formData.isTeamLeader">
                    <option value="true">Oui</option>
                    <option value="false">Non</option>
                </select>
            </div>
            <button type="submit" class="add-button">Ajouter</button>
        </form>
    </div>

</template>



<style scoped>
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