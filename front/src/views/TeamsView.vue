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
console.log('USER IN TEAMMMMMs:', user.value)


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
        teams.value = await api.getTeams();
        if (!teams.value) {
            teams.value = [];
        }
        console.log("teams:", teams.value)
    } catch (e) {
        console.log("Error fetching teams:", e)

    }

})
</script>


<template>
    <div class="teams" v-if="teams && teams.length > 0">
        <div class="usersTitle">
            <h2>Équipes</h2>
            <div class="buts">
                <RouterLink class="button-create-team" v-if="userisAdmin" to="/app/team/?create=true" >Créer</RouterLink>
            </div>
        </div>        
        
        <SuperTable class="arrayAllTeams" :tableData="teams" tableType="team" :tableHeaders="tableHeaders" :showActions="userisAdmin"/>
    </div>
    <div v-else>
        <p>Il n'y a pas encore d'équipe</p>
        <RouterLink class="button-create-team" v-if="userisAdmin" to="/app/team/?create=true" >Créer une équipe</RouterLink>

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

.arrayAllTeams {
    color: white;
}

.button-create-team {
    width: 110px;
    font-size: 16px;
}

.button-add-member-team {
    width: 90px;
    font-size: 12px;
}

td {
    color: white;
}


</style>