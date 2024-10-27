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

const isUserNameValid = ref<boolean>(false);
const isEmailValid = ref<boolean>(false);
const isStrongPassword = ref(false);



const isFormValid = computed(() => {
  console.log("Is form valid ? ", isUserNameValid.value && isEmailValid.value && isStrongPassword.value)
    return isUserNameValid.value && isEmailValid.value
     && isStrongPassword.value;
});

const updateFormValidity = (field:any) => {
  console.log("EMIT TRIGGGEEEEEREDDDDD:" )
  console.log("Context:", field )
    if ( field.name === 'email'){
      isEmailValid.value = field.isValid;
    }
    if ( field.name === 'username'){
      isUserNameValid.value = field.isValid;
    }
};

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
    } else {
      console.log('Attempting to register...');
      delete user.value.confirmPassword;
      console.log('User Data:', user.value);
      await auth.register({
        email: user.value.email!,
        username: user.value.username!,
        password: user.value.password!,
        role: user.value.role!
      });
    }
    router.push('/app');   
  } catch (err : any) {
    console.log('Usser not authenticated', user.value);
    console.log(err);
    const message = err.response.data.error;
    if (message === 'unauthorized') {
      error.value = 'Invalid email or password';
    } else {
      error.value = 'An error occurred';
    }
  }
};

const goTo = () => {
  if(props.authMode == 'login') router.push("/register");
  else router.push("/login")
};


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
  <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'>
  <div class="container">
    <form class="form" @submit.prevent="handleAuth" @click="hideAllErrors">
      <p :class="{ Gerror: api.hasErrorOccured }" v-show="api.hasErrorOccured">
        {{ api.errorMessage }}
      </p>
      <h2 class="title">
        {{ props?.authMode === 'login' ? 'Login' : 'Register' }}
      </h2>
      <p class="desc">
        <strong>Hey !</strong> Il faut bien quelqu’un pour veiller sur la ville...
        ça pourrait être toi ?
      </p>
      <div v-if="props.authMode == 'register'" class="input-group" >
        <InputField v-model="user.username" :name="'username'" :type="'text'" :label="'Username'" required @form-validity="updateFormValidity($event)"/>
      </div>
      <div class="input-group">
        <div class="input-group" >
        <InputField v-model="user.email" :name="'email'" :type="'text'" :label="'Email'" required @form-validity="updateFormValidity($event)"/>
        </div>
      </div>
      <div class="input-group">
        <PasswordField v-model="user.password" :name="'password'" :label="'Password'" required :showRules="authMode === 'register'" @goodPassword="goodPassword($event)"/>
      </div>
      <div v-if="props.authMode == 'register' && isStrongPassword" class="input-group">
        <PasswordField v-model="user.confirmPassword":name="'confirmPassword'" :label="'Confirm Password'" required :showRules="false"/>
      </div>
      <button v-if="props.authMode == 'register' && isStrongPassword" :disabled="!isFormValid" type="submit" :class="['auth-button', { 'inpError': props.authMode == 'register' && !passwordsMatch }]">
        {{props.authMode == 'register' ? 'Register' : 'Login'}}
      </button>
      <button v-if="props.authMode != 'register' && isStrongPassword" type="submit" :class="['auth-button', { 'inpError': !passwordsMatch }]">
        {{'Login'}}
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
  height: auto;
  width: 800px;
  padding: 64px 32px;
  background-color: #353535;
  color: white;
  font-family: 'Poppins';
  border-radius: 10px;
}

.desc {
  text-align: left;
  width: 350px;
  font-weight: 100;
}

.desc strong {
  font-weight: bold;
}

.form {
  margin: auto;
  width: 80%;
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
  text-align: center;
  width: 20%;
  height: 40px;
  background-color: #bbbbbb;
  color: white;
  border: none;
  font-weight: bold;
  text-transform: uppercase;
  border-radius: 35px;
  font-size: 16px;
  cursor: pointer;
  float: right;
  border: solid 1px white;
  transition: 0.4s;
}

.auth-button:hover {
  background-color: hsla(0, 0%, 44%, 0.2);
}

.auth-link {
  font-size: 16px;
  margin-top: 25px;
}

.auth-link a {
  color: #007bff;
  text-decoration: none;
  background-color: #353535;
  border: none;
  font-weight: normal;
  text-transform: lowercase;
  padding: 0;
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