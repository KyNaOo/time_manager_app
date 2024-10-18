<script setup lang="ts">
import instance from "../api/axios";
import {computed, onBeforeMount, ref} from "vue";
import SuperTable from "../components/SuperTable.vue";
import { store } from "../api/store";
import { UserGroupIcon } from '@heroicons/vue/24/solid'

interface User {
  id: number;
  username: string;
  email: string;
}
const response = ref<User[] | null>(null);

const userisAdmin = computed(() => {
  return store.user?.role === 'admin';
});

const tableHeaders = computed(() => {
  const headers = ['ID', 'Username', 'Email']
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
<div v-if="response">
  <div class="usersTitle">
      <h2>Users</h2>
      <UserGroupIcon class="icon"/>
  </div>
  <RouterLink v-if="userisAdmin" to="/app/user?create=true" >Create User</RouterLink>
  <!-- <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Username</th>
        <th>Email</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="user in response" :key="user.id">
        <td>{{ user.id }}</td>
        <td>{{ user.username }}</td>
        <td>{{ user.email }}</td>
        <td>
          <nav>
            <RouterLink :to="`/app/user/${user.id}`">See</RouterLink>
            <button @click="deleteUser(user.id)">Delete</button>
        </nav>
        </td>
      </tr>
    </tbody>
  </table> -->
  <SuperTable v-if="response" :tableData="response" tableType="users" :tableHeaders="tableHeaders" />
</div>
<div v-else>No users
  <RouterLink to="/app/user?create=true" >Create User</RouterLink>
</div>
</template>

<style >
.usersTitle {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 20px 0;
}
</style>