<script setup lang="ts">
import { ref } from 'vue';
import { defineProps, defineEmits, computed } from 'vue';
import type { User, Team } from '@/types/crudTypes';

interface Props {
    user?: User ;
    team?: Team;
    context: string;
    mode: string;
}

const emit = defineEmits<{
    (e: 'submit', value : any): void;
}>();

const props = defineProps<Props>();

const user = ref(props.user);
const team = ref(props.team);
const formData = computed(() => {
    if (props.context === 'user' && user.value) {
        return {
            username: user.value.username,
            email: user.value.email,
        };
    } else if (props.context === 'team' && team.value) {
        return {
            name: team.value.name,
        };
    }
    return {};
});

const handleSubmit = () => {
    emit('submit', formData.value);
};
</script>
<template>
    <form @submit.prevent="handleSubmit">
            <div v-if="props.context === 'user' && user">
                <div class="form-field">
                    <label for="username">Username:</label>
                    <input type="text" id="username" v-model="user.username" />
                </div>
                <div class="form-field">
                    <label for="email">Email:</label>
                    <input type="email" id="email" v-model="user.email" />
                </div>
            </div>
            <div v-else-if="props.context === 'team' && team">
                <div class="form-field">
                    <label for="name">Name:</label>
                    <input type="text" id="name" v-model="team.name" />
                </div>
            </div>
            <button type="submit">Save</button>

        </form>
</template>



<style scoped>
/* Add your styles here */

form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
}

.form-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
}
button {
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    width: fit-content;
}
</style>