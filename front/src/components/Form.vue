<script setup lang="ts">
import { ref } from 'vue';
import { defineProps, defineEmits, computed } from 'vue';
import type { User, Team } from '@/types/crudTypes';
import { store } from '@/api/store';


interface Props {
    user?: User ;
    team?: Team;
    context: string;
    mode: string;
}

// const test = await store.user;
// console.log('Test:', test);

const emit = defineEmits<{
    (e: 'submit', value : any): void;
    (e: 'delete'): void;
}>();

const userisAdmin = computed( () => {
  return user.value?.role === 'admin';
});


const props = defineProps<Props>();

const user = ref(props.user);
const team = ref(props.team);

const formData = computed(() => {
    if (props.context === 'user' && user.value) {
        return {
            username: user.value.username,
            email: user.value.email,
            role: user.value.role
        };
    } else if (props.context === 'team' && team.value) {
        return team.value;
    }
    return {};
});

const handleSubmit = () => {
    console.log('Form data:', formData.value);
    emit('submit', formData.value);
};

function deleteContent() {
    console.log('Delete:');
    emit('delete');
}
</script>
<template>
    <form @submit.prevent="handleSubmit">
            <div class="formu" v-if="props.context === 'user' && user">
                <div class="form-field">
                    <label for="username">Username:</label>
                    <input type="text" id="username" v-model="user.username" />
                </div>
                <div class="form-field">
                    <label for="email">Email:</label>
                    <input type="email" id="email" v-model="user.email" />
                </div>
                <div v-if="userisAdmin" class="form-field">
                    <label for="role">Rôle:</label>
                    <select id="role" v-model="user.role">
                        <option value="user">User</option>
                        <option value="manager">Manager</option>
                        <option v-if="userisAdmin" value="admin">Admin</option>
                    </select>
                </div>
            </div>
            <div v-else-if="team">
                <div class="form-field">
                    <label for="name">Name:</label>
                    <input type="text" id="name" v-model="team.title" />
                </div>
            </div>
            <div class="buts">
                <button class="save" type="submit">Save</button>
                <button v-if="props.mode !== 'create' " class="delete" @click.prevent="deleteContent">Delete</button>
            </div>
        </form>
</template>



<style scoped>
form {
    display: flex;
    flex-direction: column;
}

.form-field {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    font-size: 14px;
}

select {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    font-size: 14px;
}

.save, .delete {
    margin-left: 15px; 
}

.buts {
    display: flex; 
    justify-content: flex-end; 
}

label {
    font-size: 18px;
}

.save {
    padding: 10px 24px;
    font-weight: bold;
    text-transform: uppercase;
    transition: 0.4s;
    background-color: #FFCC26;
    color: white;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    width: fit-content;
    margin-top: 30px;
    font-size: 14px;
}

.delete {
    padding: 10px 24px;
    font-weight: bold;
    text-transform: uppercase;
    transition: 0.4s;
    background-color: #cd1d1d;
    color: white;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    width: fit-content;
    margin-top: 30px;
    font-size: 14px;
}

.delete:hover {
    cursor: pointer;
    transition: 0.4s;
    background-color: #671e1e;
}

.save:hover {
    cursor: pointer;
    transition: 0.4s;
    background-color: #9a790e;
}

.formu {
    display: flex;
    flex-direction: column;
    gap: 15px;
}
</style>