  
<script setup lang="ts">

</script>

<template>
    <div class="loader"></div>
  </template>

  <style scoped>
  .loader {
    border: 4px solid rgba(0, 0, 0, 0.1); /* Light gray border */
    border-top: 4px solid #3498db; /* Blue color for the loader */
    border-radius: 50%; /* Make it circular */
    width: 50px; /* Fixed width */
    height: 50px; /* Fixed height */
    animation: spin 1s linear infinite; /* Spin animation */
  }
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  </style>
  