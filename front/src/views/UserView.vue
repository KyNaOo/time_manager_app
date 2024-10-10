<template>
    <div class="user-view">
        <h1>User Information</h1>
        <p><strong>ID:</strong> {{ user.id }}</p>
        <p><strong>Username:</strong> {{ user.username }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import axios from 'axios'

const user = ref(null)

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

<style scoped>
.user-view {
    padding: 20px;
}
</style>