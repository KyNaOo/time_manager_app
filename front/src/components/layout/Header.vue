<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useRouter, useRoute } from 'vue-router';
import { store } from '../../api/store';
import { BeakerIcon, UserIcon , ArrowLongRightIcon, HomeIcon } from '@heroicons/vue/24/solid'
import { computed } from 'vue';

const router = useRouter();
const route = useRoute();
const logout = async () => {
  localStorage.clear();
  window.location.reload();
};


const isLogged = computed(() => {
    return store.hasLogin;
});

</script>

<template>
    <header class="header">
        <h1 class="logo" @click="router.push('/')">Timetracker</h1>
        <nav>
            <ul class="navList loggedOut" v-if="!isLogged">
                <li><router-link to="/"><HomeIcon class="icon"/> <span class="navText">Home</span></router-link></li>
                <li><router-link to="/login"><UserIcon class="icon"/> <span class="navText">Login</span></router-link></li>
                <li><router-link to="/register"><BeakerIcon class="icon"/> <span class="navText">Register</span></router-link></li>
            </ul>
            <ul class="navList loggedIn" v-else>
                <li><router-link to="/app/profile"><UserIcon class="icon"/> <span class="navText">Profile</span></router-link></li>
                <li class="logout" @click="logout"> <span class="navText">Logout</span><ArrowLongRightIcon class="icon"/></li>
            </ul>
        </nav>
    </header>
</template>



<style scoped>
.header {
    background-color: #333;
    color: white;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    position: sticky;
    top: 0;
    z-index: 2;

}
.logo{
    cursor: pointer;
    margin: 0;
}
.header h1 {
    margin: 0;
}

.header .icon {
    width: 20px;
}


.navList {
    list-style: none;
    display: flex;
    gap: 1rem;
    padding: 0;
    margin: 0;
    align-items: center;
}

.navList li{
    color: white;
    text-decoration: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.header nav ul li a {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 5px;
    transition: background-color 0.3s ease;
}

.navText {
    color: white;
}

.logout {
    color: white;
    background-color: #ff4d4d;
    border: none;
    border-radius: 5px;
    transition: background-color 0.3s ease;
    padding: 0.5rem 1rem;

}

    .logout:hover {
        background-color: #ff1a1a;
}
</style>