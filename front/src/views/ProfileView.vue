
<script setup lang="ts">
import UserView from './UserView.vue';

 

</script>

<template>
    <div class="profile">
        <UserView />
    </div>
</template>


<style scoped>
.profile {
    padding: 20px;
    max-width: 600px;
    margin: 0 auto;
}

.profile-details {
    background: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-details p {
    margin: 10px 0;
}
</style>