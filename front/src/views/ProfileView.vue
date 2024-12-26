<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import type { User } from '@/types/crudTypes'
import { store } from '@/api/store';
import UserBox from '@/components/UserBox.vue'
import Loader from '@/components/Loader.vue';


const user = ref<User | null>(null);

console.log('ProfileView store:', store)

onBeforeMount(async () => {
    try {
        console.log('Fetching user in profile view...')
        user.value = await store.user;
        console.log('Stored User:', user.value)
    } catch (error) {
        console.error('Error fetching user data:', error)
    }
})

</script>

<template>
    <div class="ProfileView">
        <UserBox v-if="user" :user="user"/>
        <Loader v-else/>
    </div>
</template>


<style scoped>
.ProfileView {
    padding: 20px;
    width: 100%;
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
