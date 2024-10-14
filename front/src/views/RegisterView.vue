<script setup lang="ts">
import { ref } from 'vue';

const username = ref('');
const email = ref('');
const password = ref('');

const register = () => {
    // Handle registration logic here
    console.log('Registering:', username.value, email.value, password.value);
};
</script>

<template>
    <div class="register-view">
        <h1>Register</h1>
        <form @submit.prevent="register">
            <div>
                <label for="username">Username:</label>
                <input type="text" id="username" v-model="username" required />
            </div>
            <div>
                <label for="email">Email:</label>
                <input type="email" id="email" v-model="email" required />
            </div>
            <div>
                <label for="password">Password:</label>
                <input type="password" id="password" v-model="password" required />
            </div>
            <button type="submit">Register</button>
        </form>
    </div>
</template>



<style scoped>
.register-view {
    width: 600px;
    margin: 0 auto;
    padding: 1em;
    border: 1px solid #ccc;
    border-radius: 4px;
}


form {
    margin-top: 1em;
    width: 100%;
}

.register-view h1 {
    text-align: center;
}

.register-view form div {
    margin-bottom: 1em;
}

.register-view label {
    display: block;
    margin-bottom: 0.5em;
}

.register-view input {
    width: 100%;
    padding: 0.5em;
    box-sizing: border-box;
}

.register-view button {
    width: 100%;
    padding: 0.7em;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.register-view button:hover {
    background-color: #0056b3;
}
</style>
