<script setup lang="ts">
import instance from "../api/axios";
import {computed, onBeforeMount, ref} from "vue";
import SuperTable from "../components/SuperTable.vue";
import { store } from "../api/store";
import { UserGroupIcon } from '@heroicons/vue/24/solid'
import type { User } from "../types/crudTypes";


const response = ref<User[] | null>(null);

const user = ref<User | null>(null);

onBeforeMount(async () => {
  try {
    user.value = await store.user;
    console.log("users:", response.value)
  } catch (e) {
    console.log("Error fetching users:", e)
  }
});

const userisAdmin = computed( () => {
  return user.value?.role === 'admin';
});

const tableHeaders = computed(() => {
  const headers = user.value ? Object.keys(user.value) : ['ID', 'Username', 'Email', 'Role'];
  if (userisAdmin.value) {
    headers.push('Actions');
  }
  return headers;
});

onBeforeMount(async () => {
  try {
    const apiResp = await instance.get(`/api/users`);
    response.value = apiResp.data.data;
    console.log("users:", response.value)
  } catch (e) {
    console.log("Error fetching users:", e)

  }

})


</script>

<template>
<div class="user-page" v-if="response">
  <div class="usersTitle">
      <h2>Utilisateur</h2>
      <RouterLink class="button-add-user" v-if="userisAdmin" to="/app/user?create=true" >Créer un utilisateur</RouterLink>
  </div>
  
  <SuperTable v-if="response" :tableData="response" tableType="user" :tableHeaders="tableHeaders" :showActions="userisAdmin"/>
</div>
<div v-else>Il n'y a pas d'utilisateur
  <RouterLink to="/app/user?create=true" >Create User</RouterLink>
</div>
</template>

<style >
.usersTitle {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 20px 0;
    text-transform: uppercase;
    font-weight: bold;
    justify-content: space-between;
}

h2 {
  font-size: 28px;
}

.button-add-user {
  width: 200px;
  background-color: #FFCC26;
}

.button-add-user:hover {
  background-color: #947920;
}

.user-page {
  display: flex;
  flex-direction: column;
}

</style>