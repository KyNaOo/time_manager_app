<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppLayout from './components/layout/AppLayout.vue';

</script>

<template>
  <main>
    <router-view v-slot="{ Component }">
      <AppLayout>
        <transition name="fade" mode="out-in">
          <component :is="Component" />

        </transition>
        </AppLayout>

    </router-view>
  </main>
  <!-- <RouterView /> -->
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.7s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}


</style>
