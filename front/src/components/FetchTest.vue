<script setup lang="ts">
import axios from "axios";
import {onBeforeMount, ref} from "vue";


const response = ref(null)
onBeforeMount(async () => {
  try {
    const apiResp = await axios.get(`http://localhost:4000/api/users`);
    response.value = apiResp.data;
    console.log(apiResp);
    console.log("users:", response.value)
  } catch (e) {
    console.log("Error fetching users:", e)

  }

})
</script>

<template>
<div v-if="response">{{response}}</div>
  <div v-else> No users</div>
</template>

<style scoped>

</style>