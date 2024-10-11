<script setup lang="ts">
import axios from "axios";
import {onBeforeMount, ref} from "vue";

interface User {
  id: number;
  username: string;
  email: string;
}
const response = ref<User[] | null>(null)

const deleteUser = async (userId: number) => {
  try {
    console.log(`Delete user with ID: ${userId}`);
    await axios.delete(`http://localhost:4000/api/users/${userId}`);
    response.value = response.value?.filter(user => user.id !== userId) || null;
    console.log(`Deleted user with ID: ${userId}`);
    // Redirect to the users page
    // window.location.href = '/users';
  } catch (e) {
    console.log(`Error deleting user with ID: ${userId}`, e);
  }
};

onBeforeMount(async () => {
  try {
    const apiResp = await axios.get(`http://localhost:4000/api/users`);
    response.value = apiResp.data.data;
    console.log("users:", response.value)
  } catch (e) {
    console.log("Error fetching users:", e)

  }

})


</script>

<template>
<div v-if="response">
  <h3>Users</h3>
  <RouterLink to="/user?create=true" >Create User</RouterLink>
  <table>
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
            <RouterLink :to="`/user/${user.id}`">See</RouterLink>
            <button @click="deleteUser(user.id)">Delete</button>
        </nav>
        </td>
      </tr>
    </tbody>
  </table>
</div>
<div v-else>No users</div>
</template>

<style scoped>

</style>