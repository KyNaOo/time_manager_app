
<script setup lang="ts"> 

</script>

<template>
    <div class="profile">
        <h1>User Profile</h1>
        <div class="profile-details">
            <p><strong>Name:</strong> John Doe</p>
            <p><strong>Email:</strong> john.doe@example.com</p>
            <p><strong>Location:</strong> Paris, France</p>
        </div>
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