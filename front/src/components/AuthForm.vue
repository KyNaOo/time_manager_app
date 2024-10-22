<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import {useApi} from "../api/index";
import { store } from "../api/store";
import type { AuthMode } from "@/types/crudTypes";
import InputField from "./forms/InputField.vue";
import PasswordField from "./forms/PasswordField.vue";
import { useAuth } from "@/api/auth";
import type { User } from "../types/crudTypes";
const auth = useAuth();
const api = useApi(); 

const error = ref<string | null>(null);

const props = defineProps({
  authMode: {
    type: String as () => AuthMode,
    required: true,
  },
});

const user = ref<Partial<User>>(
  props.authMode === 'login'
    ? {
        email: '',
        password: '',
      }
    : {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'admin',
      }
);

const router = useRouter();

const hideAllErrors = () => {
    api.turnOffError();
};

const handleAuth = async () => {
  try {
    if (!user.value || !user.value.email || !user.value.password) {
      console.error('No user data');
      return;
    }
    console.log('Auth Mode:', props.authMode);
    console.log('User Data:', user.value);
    if(props.authMode == 'login') {
      console.log('Attempting to log in...');
      await auth.signIn(user.value.email, user.value.password!);
      console.log('Logged in');

    } else {
      console.log('Attempting to register...');
      delete user.value.confirmPassword;
      // const hashedPassword = await bcrypt.hash(user.value.password!, 10);
      // user.value.password = hashedPassword;
      console.log('User Data:', user.value);
      await auth.register({
        email: user.value.email!,
        username: user.value.username!,
        password: user.value.password!,
        role: user.value.role!
      });
    }
    router.push('/');   
  } catch (err : any) {
    console.log('USer not authenticated', user.value);
    console.log(err.response.data.error);
    const message = err.response.data.error;
    if (message === 'unauthorized') {
      error.value = 'Invalid email or password';
    } else {
      error.value = 'An error occurred';
    }
    // store.showModal({message: err.response.data.error, title: 'Error'});
  }
};

const goTo = () => {
  if(props.authMode == 'login') router.push("/register");
  else router.push("/login")
};

const isStrongPassword = ref(false);

const goodPassword = (isGoodPassword: boolean) => {
  console.log('Password is good:', isGoodPassword);
  isStrongPassword.value = isGoodPassword;
};

const passwordsMatch = computed(() => {
  return user.value.password === user.value.confirmPassword;
});


watch(user, (newValue) => {
  console.log('User updated:', newValue);
}, { deep: true });

</script>
<template>
  <div class="container">
    <form class="form" @submit.prevent="handleAuth" @click="hideAllErrors">
      <p :class="{ Gerror: api.hasErrorOccured }" v-show="api.hasErrorOccured">
        {{ api.errorMessage }}
      </p>
      <h2 class="title">
        {{ props?.authMode === 'login' ? 'Login' : 'Register' }}
      </h2>
      <div v-if="props.authMode == 'register'" class="input-group" >
        <InputField v-model="user.username" :name="'username'" :type="'text'" :label="'Username'" required/>
      </div>
      <div class="input-group">
        <div class="input-group" >
        <InputField v-model="user.email" :name="'email'" :type="'text'" :label="'Email'" required/>
        </div>
      </div>
      <div class="input-group">
        <PasswordField v-model="user.password" :name="'password'" :label="'Password'" required :showRules="authMode === 'register'" @goodPassword="goodPassword($event)"/>
      </div>
      <div v-if="props.authMode == 'register' && isStrongPassword" class="input-group">
        <PasswordField v-model="user.confirmPassword":name="'confirmPassword'" :label="'Confirm Password'" required :showRules="false"/>
      </div>
      <button type="submit" :class="['auth-button', { 'inpError': props.authMode == 'register' && !passwordsMatch }]">
        {{props.authMode == 'register' ? 'Register' : 'Login'}}
      </button>
      <span v-if="!passwordsMatch && authMode === 'register'" class="error">Passwords do not match</span>
      <span v-if="error" class="error">{{error}}</span>
      <p class="auth-link">Click <a @click="goTo">here</a> to {{props?.authMode == 'register' ? 'login' : 'register'}}</p>
    </form>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 400px;
}

.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  width: 100%;
}

.title {
  font-size: 24px;
  margin-bottom: 10px;
}

.input-group {
  width: 100%;
  position: relative;
}



.auth-button {
  width: 100%;
  height: 40px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.auth-button:hover {
  background-color: #0056b3;
}

.auth-link {
  font-size: 16px;
  margin-top: 15px;
}

.auth-link a {
  color: #007bff;
  text-decoration: none;
}

.auth-link a:hover {
  text-decoration: underline;
  cursor: pointer;
}

.error {
  color: red;
  font-size: 15px;
  margin: 0;

  
}

.Gerror {
  position: absolute;
  color: #f29191;
  margin: 0;
  top: 5px;
  right: 5px;
  font-size: 17px;
}

.inpError {
  background-color: lightgray;
  color: white;
  cursor: not-allowed;
}
</style>