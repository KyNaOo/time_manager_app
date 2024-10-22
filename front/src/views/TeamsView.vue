<script setup lang="ts">
import SuperTable from '@/components/SuperTable.vue';
import { UserGroupIcon } from '@heroicons/vue/24/solid'

import { ref, onBeforeMount, computed } from 'vue';

import { store } from '@/api/store';

import type { Team,  User } from '@/types/crudTypes';

import instance from '@/api/axios';

import { useApi } from '@/api';

const api = useApi();
const user = ref<User | null>(null);
const teams = ref<Team[] | null>(null);
const userisAdmin = computed( () => {
  return user.value?.role === 'admin';
});


const tableHeaders = computed(() => {

const headers = ["Id", "Name"];
  if (userisAdmin.value) {
    headers.push('Actions');
  }
  return headers;
});

onBeforeMount(async () => {
    try {
        user.value = await store.user;
        teams.value = await api.getUserTeams(user.value!);
        if (!teams.value) {
            teams.value = [];
        }
        // teams.value.forEach((team) => {
        //     if (team.is_team_leader !== undefined) {
        //         delete team?.is_team_leader;
        //     }
        // });
        console.log("teams:", teams.value)
    } catch (e) {
        console.log("Error fetching teams:", e)

    }

})
</script>


<template>
    <div class="teams">
        <div class="usersTitle">
            <h2>Ton équipe</h2>
            <RouterLink class="button-add-member-team" v-if="userisAdmin" to="/app/team/?create=true" >Ajouter un membre</RouterLink>
        </div>        
        
        <SuperTable v-if="teams" :tableData="teams" tableType="team" :tableHeaders="tableHeaders" :showActions="userisAdmin"/>
    </div>
</template>



<style scoped>
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

.button-add-member-team {
    width: 200px;
}
</style>