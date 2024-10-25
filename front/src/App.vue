<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppLayout from './components/layout/AppLayout.vue';
import Modal from './components/modals/ModalMessage.vue';
import { store } from './api/store';
</script>

<template>
  <main>
      <AppLayout>
        <router-view v-slot="{ Component }" :key="$route.fullPath">
          <!-- <transition name="fade" mode="out-in"> -->
            <component :is="Component" />
          <!-- </transition> -->
          </router-view>
      </AppLayout>
      <Modal v-if="store.modal !== null" :message="store.modal.message" :title="store.modal.title" />
  </main>
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
