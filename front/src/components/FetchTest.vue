<script setup lang="ts">
import axios from "axios";
import {onBeforeMount, ref} from "vue";


interface User {
  id: number;
  username: string;
  email: string;
}

const response = ref<User[] | null>(null)
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
  <!-- {{ response }} -->
  <div v-for="user in response" :key="user.id">
    <p>ID :{{user.id}}</p>
    <p>Username :{{user.username}}</p>
    <p>Email :{{user.email}}</p>
  </div>
</div>
  <div v-else> No users</div>
</template>

<style scoped>

</style>