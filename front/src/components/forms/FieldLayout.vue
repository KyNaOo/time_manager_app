<script setup lang="ts">
import { ref, defineProps, inject } from 'vue';


const props = defineProps<{
    name: string;
    label: string;
    error?: string ;
}>();

const inputValue = ref('');
</script>

<template>
    <div :class="['FieldLayout', props.name]">
        <label class="label" :for="props.name">{{ props.label }}:</label>
        <slot />
        <span v-if="error">{{ error }}</span>
    </div>
</template>

<style scoped>
.FieldLayout{
    margin: 1rem 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    position: relative;
    justify-content: center;
}

.label {
  font-size: 16px;
}
</style>