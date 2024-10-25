<script setup lang="ts">
import { RouterLink } from 'vue-router'

</script>

<template>
  <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'>
  <div class="accueil">
    <h1>Bienvenue sur TimeTrack</h1>
    <h3>GEREZ VOTRE TEMPS COMME CLOCK TIME</h3>
    <nav>
        <RouterLink class="login" to="/login">Login</RouterLink>
        <RouterLink class="register" to="/register">Register</RouterLink>
    </nav>
  </div>
</template>

<style scoped>
.accueil {
  display: flex;
  flex-direction: column;
  font-family: 'Poppins';
  background-color: #353535;
  padding: 80px 60px;
  border-radius: 25px;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.accueil h1 {
  margin: auto;
  font-size: 42px;
  font-weight: bold;
}

.acceuil h3 {
  font-size: 32px;
  font-weight: lighter;
  margin: auto;
}

nav {
  width: 220px;
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
}
</style>
