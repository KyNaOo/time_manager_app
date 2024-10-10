<script setup lang="ts">
import { ref } from 'vue';
import { defineProps, defineEmits, computed } from 'vue';

interface User {
  id?: number ;
  username: string;
  email: string;
}

interface Props {
    user: User ;
    mode: string;
}

const emit = defineEmits<{
    (e: 'submit'): void;
}>();

const action = computed(() => {
    return props.mode === 'create' ? 'create' : 'edition';
});

const props = defineProps<Props>();

const user = ref(props.user);

const handleSubmit = () => {
    emit('submit');
};
</script>
<template>
    <form @submit.prevent="handleSubmit">
            <div>
                <label for="username">Username:</label>
                <input type="text" id="username" v-model="user.username" />
            </div>
            <div>
                <label for="email">Email:</label>
                <input type="email" id="email" v-model="user.email" />
            </div>
            <button type="submit">Save</button>
        </form>
</template>



<style scoped>
/* Add your styles here */
</style>