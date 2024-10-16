<script setup lang="ts">
import { shallowRef, computed } from "vue";
import { useRouter } from "vue-router";
import {useApi} from "../api/index";
import { store } from "../api/store";
import type { AuthMode } from "@/types/crudTypes";
import InputField from "./forms/InputField.vue";
import PasswordField from "./forms/PasswordField.vue";


const api = useApi();
console.log(api);
const props = defineProps({
  authMode: {
    type: String as () => AuthMode,
    required: true,
  },
});

const user = shallowRef({
  username: null,
  email: null,
  password: null,
  confirmPassword: null,
});

const router = useRouter();
const showPassword = shallowRef(false);

const hideAllErrors = () => {
    api.turnOffError();
};

const handleAuth = async () => {
  try {
    await api.authenticate(`/api/users`, user.value, props.authMode);
    router.push("/app");
  } catch (err) {
    console.log('USer not authenticated', user.value);
    console.log(err);
  }
};

const goTo = () => {
  if(props.authMode == 'login') router.push("/register");
  else router.push("/login")
};

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
        <InputField :name="'username'" :type="'text'" :label="'Username'" required/>
      </div>
      <div class="input-group">
        <div class="input-group" >
        <InputField :name="'email'" :type="'text'" :label="'Email'" required/>
        </div>
      </div>
      <div class="input-group">
        <PasswordField :name="'password'" :label="'Password'" required/>
      </div>
      <div v-if="props.authMode == 'register'" class="input-group">
        <PasswordField :name="'confirmPassword'" :label="'Confirm Password'" required/>
      </div>
      <button type="submit" class="auth-button">{{props.authMode == 'register' ? 'Register' : 'Login'}}</button>
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
  position: absolute;
  color: #f29191;
  top: 0;
  top: 0;
  right: 10px;
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
  border: 1px solid #ffcccc;
}
</style>