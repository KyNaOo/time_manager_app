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
    store.setToken(null);
    router.push('/');
};


const isLogged = computed(() => {
    return store.token !== null;
});

</script>

<template>
    <header class="header">
        <img class="logoimg" src="../../assets/logoImg.svg" @click="router.push('/')" alt="logo">
        <nav>
            <ul class="navList loggedOut" v-if="!isLogged">
                <li><router-link to="/"><span>Home</span></router-link></li>
                <li><router-link to="/login"><span>Login</span></router-link></li>
                <li><router-link to="/register"><span>Register</span></router-link></li>
            </ul>
            <ul class="navList loggedIn" v-else>
                <li><router-link to="/app/profile"><span>Profil</span></router-link></li>
                <li class="logout" @click="logout"> <span>Logout</span></li>
            </ul>
        </nav>
    </header>
</template>



<style scoped>
.header {
    background-color: #333;
    color: white;
    padding: 0px 50px 0px 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    position: sticky;
    top: 0;
    z-index: 2;
}

.logoimg{
    cursor: pointer;
    margin: 0;
    width: 250px;
}
.header h1 {
    margin: 0;
}

.header .icon {
    width: 20px;
}

li {
    text-transform: uppercase;
    font-weight: bold;
    text-align: center;
    font-size: 20px;
}

.navList {
    list-style: none;
    display: flex;
    gap: 1rem;
    padding: 0;
    margin: 0;
    align-items: center;
}

a {
    display: flex;
    background-color: rgb(0, 0, 0);
    order: none;
    border-radius: 5px;
    transition: background-color 0.3s ease;
    padding: 0.5rem 1rem;
    width: 130px;
    border: none;
}

a:hover {
    cursor: pointer;
    background-color: #8a8a8a;
}

.logout {
    color: white;
    display: flex;
    background-color: #cd1d1d;
    border: none;
    border-radius: 5px;
    transition: background-color 0.3s ease;
    padding: 0.5rem 1rem;
    width: 130px;
}

.logout:hover {
    cursor: pointer;
    background-color: #7d1919;
}

span {
    margin: auto;
}
</style>