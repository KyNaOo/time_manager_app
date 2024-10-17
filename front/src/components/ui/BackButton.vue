<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function goBack() {
    router.back();
}
</script>

<template>
    <button @click="goBack">Back</button>
</template>

<style scoped>
button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}
</style>
