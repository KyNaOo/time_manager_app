<script setup lang="ts">
import FetchTest from "@/components/FetchTest.vue";
</script>


<template>
  <div class="users">
    <h1>This is the users page</h1>
    <FetchTest/>
    <RouterLink to="/">Home</RouterLink>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .users {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
