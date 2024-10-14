<script setup lang="ts">
import Header from './Header.vue';
import Footer from './Footer.vue'
</script>

<template>
        <Header />
        <div class="MainContent">
            <slot></slot>
        </div>
        <Footer />
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