<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppLayout from './components/layout/AppLayout.vue';
import Modal from './components/modals/ModalMessage.vue';
import { store } from './api/store';
</script>

<template>
  <main>
      <AppLayout>
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
        </AppLayout>
    <Modal v-if="store.modal !== null" :message="store.modal.message" :title="store.modal.title" />
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
