
<script setup lang="ts">
import { ref, onBeforeMount, computed } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import Form from '@/components/Form.vue'

interface User {
  id?: number ;
  username: string;
  email: string;
}

const user = ref<User | null>(null)
const route = useRoute()
const userId = ref(route.params.id)
console.log('Full Route :', route.fullPath)
console.log('Route params:', route.query)

const mode = computed(() => route.query.create ? 'create' : 'edition');

console.log('Form mode:', mode.value)


const modifyUser = async() => {
try {
    console.log(`Modify user with ID:`, userId.value);
    const resp = await axios.put(`http://localhost:4000/api/users/${userId.value}`, {
        user: {
            username: user.value?.username,
            email: user.value?.email
        }
    });
    console.log(`Modified user with ID: ${userId.value}`);
    // Add your logic to handle the response here
} catch (e) {
    console.log(`Error modifying user with ID: ${userId.value}`, e);
}
};

const createUser = async() => {
try {
    console.log(`Create user`);
    const resp = await axios.post(`http://localhost:4000/api/users`, {
        user: {
            username: user.value?.username,
            email: user.value?.email
        }
    });
    console.log(`Created user : ${resp.data.data}`);
    // Add your logic to handle the response here
} catch (e) {
    console.log(`Error creating user: ${userId.value}`, e);
}
};

const action = async() => {
if (mode.value === 'create') {
    await createUser()
} else {
    await modifyUser()
}
};


onBeforeMount(async () => {
    try {
        console.log('Full Route :', route)
        if (mode.value === 'create') {
            user.value = {
                username: '',
                email: ''
            }
            return
        }
        const response = await axios.get(`http://localhost:4000/api/users/${userId.value}`)
        console.log('User data:', response.data)
        user.value = response.data.data
    } catch (error) {
        console.error('Error fetching user data:', error)
    }
})
</script>

<template>
    <div class="user-view" v-if="user" >
        <h1>{{mode}} User</h1>

        <Form :user="user" :mode="mode" @submit="action" />
    </div>
    <div v-else>
        <p>User not found</p>
    </div>
 
</template>


<style scoped>
.user-view {
    padding: 20px;
}
</style>