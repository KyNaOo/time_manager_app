
<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import axios from 'axios'

interface User {
  id: number;
  username: string;
  email: string;
}

const user = ref<User | null>(null)

import { useRoute } from 'vue-router'

const route = useRoute()
const userId = ref(route.params.userId)

onBeforeMount(async () => {
    try {
        const response = await axios.get(`/api/users/${userId.value}`)
        user.value = response.data
    } catch (error) {
        console.error('Error fetching user data:', error)
    }
})
</script>

<template>
    <div class="user-view" v-if="user">
        <h1>User Information</h1>
        <p><strong>ID:</strong> {{ user.id }}</p>
        <p><strong>Username:</strong> {{ user.username }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
    </div>
</template>


<style scoped>
.user-view {
    padding: 20px;
}
</style>