<script setup lang="ts">
import AppHeader from './Header.vue';
import AppFooter from './Footer.vue'
</script>

<template>
      <AppHeader/>
        <div class="MainContent">
            <slot></slot>
        </div>
        <AppFooter/>
</template>



<style scoped>
.MainContent {
    padding: 20px;
    flex: 2;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    
}
</style>