<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import type { User } from '@/types/crudTypes'
import { store } from '@/api/store';
import UserBox from '@/components/UserBox.vue'
import { useRoute } from 'vue-router'
import { useApi } from '@/api';

const api = useApi();
const route = useRoute()
const user = ref<User | null>(null)
const userId = ref<any>(route.params.id ? route.params.id : null)

onBeforeMount(async () => {
    try {
        user.value = await api.getUser(Number(userId.value))
    } catch (error) {
        console.error('Error fetching user data:', error)
    }
})
</script>

<template>
    <div class="UserView">
        <UserBox :user="user" />
    </div>
</template>


<style scoped>
.UserView {
    width: 100%;
}
.ProfileView {
    padding: 20px;
    max-width: 600px;
    margin: 0 auto;
}

.profile-details {
    background: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.profile-details p {
    margin: 10px 0;
}
</style>




