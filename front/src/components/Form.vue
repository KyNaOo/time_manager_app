<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { defineProps, defineEmits, computed } from 'vue';
import type { User, Team } from '@/types/crudTypes';
import { store } from '@/api/store';
interface Props {
  user?: User;
  team?: Team;
  context: string;
  mode: string;
}
const props = defineProps<Props>();


const emit = defineEmits<{
  (e: 'submit', value: any): void;
  (e: 'delete'): void;
}>();
const user = ref(props.user);
const team = ref(props.team);
const usernameError = ref('');
const currentUser = ref<User | null>(null);

const currentUserisAdmin = computed( () => {
  return currentUser.value?.role === 'admin';
});

const isUserCurrentUser = ref(false);

const userCanModify = computed(() => {
  if (isUserCurrentUser.value === true){
    return true;
  }
  return currentUserisAdmin.value === true;
});

const detectInjection = (input: string): boolean => {
  const dangerousPatterns = [
    /<script.*?>.*?<\/script>/gi, // Balises script
    /\b(on\w+=|javascript:|alert\(|eval\(|document\.cookie|window\.location)/gi, // Attributs ou méthodes XSS
    /(--|\b(SELECT|UPDATE|DELETE|INSERT|DROP|ALTER|CREATE|TRUNCATE)\b)/gi, // SQL injection keywords
    /[<>;'"]/
  ];
  return dangerousPatterns.some((pattern) => pattern.test(input));
};


const formData = computed(() => {
  if (props.context === 'user' && user.value) {
    return {
      username: user.value.username,
      email: user.value.email,
      role: user.value.role // Enlever le mot de passe
    };
  } else if (props.context === 'team' && team.value) {
    return team.value;
  }
  return {};
});

const handleSubmit = () => {
  usernameError.value = '';

  if (detectInjection(user.value?.username || '')) {
    usernameError.value = 'Username is not valid'; //
    return;
  }

  console.log('Form data:', formData.value);
  emit('submit', formData.value);
};

function deleteContent() {
  console.log('Delete:');
  emit('delete');
}

onBeforeMount(async () => {
  currentUser.value = await store.user;
  console.log('Current User:', currentUser.value)
  console.log('User:', user.value)
  if (currentUser.value && user.value) {
    isUserCurrentUser.value = currentUser.value.id === user.value.id;
    console.log('User can modify?', isUserCurrentUser.value)
  }
});
</script>

<template>
    <form @submit.prevent="handleSubmit">
      <div class="formu" v-if="props.context === 'user' && user">
        <div class="form-field">
          <label for="username">Username:</label>
          <input type="text" id="username" v-model="user.username" :disabled="!userCanModify" />
        </div>
        <div class="form-field">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="user.email" :disabled="!userCanModify" />
        </div>
        <div class="form-field">
          <label for="role">Rôle:</label>
          <select id="role" v-model="user.role" :disabled="!currentUserisAdmin">
            <option value="user">User</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>
      <div v-if="team">
        <div class="form-field">
          <label for="name">Name:</label>
          <input type="text" id="name" v-model="team.title" :disabled="!userCanModify" />
        </div>
      </div>
      <div class="buts" v-if="userCanModify">
        <button class="save" type="submit">Save</button>
        <button v-if="props.mode !== 'create'" class="delete" @click.prevent="deleteContent">Delete</button>
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

.error-message {
  color: red;
  font-size: 15px;
}
</style>
