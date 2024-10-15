<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useRouter, useRoute } from 'vue-router';
import { store } from '../../api/store';
const router = useRouter();
const route = useRoute();
const logout = async () => {
  localStorage.clear();
  store.updateHasLogin(false);
  store.updateUser(null);
  router.push("/login");
};

const isLogged = () => {
    console.log('isLogged:', store.hasLogin);
  return store.hasLogin;
};

</script>

<template>
    <header class="header">
        <h1>Timetracker</h1>
        <nav>
            <ul class="navList loggedOut" v-if="!isLogged()">
                <li><router-link to="/">Home</router-link></li>
                <li><router-link to="/login">Login</router-link></li>
                <li><router-link to="/register">Register</router-link></li>
            </ul>
            <ul class="navList loggedIn" v-else>
                <li><router-link to="/app/profile">Profile</router-link></li>
                <li class="logout"@click="logout">Logout</li>
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
}

.header h1 {
    margin: 0;
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
}

.header nav ul li a:hover {
    text-decoration: underline;
}

.logout {
    color: white;
    background-color: #ff4d4d;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 5px;
    transition: background-color 0.3s ease;
    }

    .logout:hover {
        background-color: #ff1a1a;
}
</style>