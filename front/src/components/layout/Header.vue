<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useRouter, useRoute } from 'vue-router';
import { store } from '../../api/store';
const router = useRouter();
const route = useRoute();
const logout = async () => {
  localStorage.clear();
  store.updateHasLogin(false);
  store.updateName(null);
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
            <ul>
                <li><router-link to="/">Home</router-link></li>
                <template v-if="!isLogged()">
                    <li><router-link to="/login">Login</router-link></li>
                    <li><router-link to="/register">Register</router-link></li>
                </template>
                <li v-if="isLogged()" @click="logout">Logout</li>
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

.header nav ul {
    list-style: none;
    display: flex;
    gap: 1rem;
    padding: 0;
    margin: 0;
}

.header nav ul li a {
    color: white;
    text-decoration: none;
}

.header nav ul li a:hover {
    text-decoration: underline;
}
</style>