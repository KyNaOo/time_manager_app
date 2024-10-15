<script setup lang="ts">
import { shallowRef, computed } from "vue";
import { useRouter } from "vue-router";
import {useApi} from "../api/index";
import { store } from "../api/store";


const api = useApi();
console.log(api);
const props = defineProps({
  authName: String,
});

const user = shallowRef({
  username: null,
  email: null,
  password: null,
});

const router = useRouter();
const showPassword = shallowRef(false);

const hideAllErrors = () => {
    api.turnOffError();
};

const handleAuth = async () => {
  try {
    await api.authenticate(`/api/users`, user.value);
    router.push("/app");
  } catch (err) {
    console.log('USer not authenticated', user.value);
    console.log(err);
  }
};

const goTo = () => {
  if(props.authName == 'login') router.push("/register");
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
        {{ props?.authName === 'login' ? 'Login' : 'Register' || "Authentication" }}
      </h2>
      <div class="input-group" >
        <label for="username" class="input-label"
          >Username
          <span v-show="api.usernameError.value" :class="{ error: api.usernameError.value }"
            >required</span
          ></label
        >
        <input
          type="text"
          id="username"
          name="username"
          v-model="user.username"
          class="input-field"
          autocomplete="name"
          :class="{ inpError: api.usernameError.value }"
        />
      </div>
      <div class="input-group">
        <label for="email" class="input-label"
          >Email
          <span v-show="api.emailError.value" :class="{ error: api.emailError.value }"
            >required</span
          ></label
        >
        <input
          type="email"
          id="email"
          name="email"
          v-model="user.email"
          class="input-field"
          autocomplete="email"
          :class="{ inpError: api.emailError.value }"
        />
      </div>
      <div class="input-group">
        <label for="password" class="input-label"
          >Password
          <span v-show="api.passwordError" :class="{ error: api.passwordError }">{{
            api.passwordErrorMessge ? api.passwordErrorMessge.value : "required"
          }}</span></label
        >
        <input
          :type="showPassword ? 'text' : 'password'"
          id="password"
          name="password"
          v-model="user.password"
          class="input-field"
          autocomplete="current-password"
          :class="{ inpError: api.passwordError.value }"
        />
        <span class="password-toggle" @click="showPassword = !showPassword">
            {{ showPassword ? "Hide" : "Show" }}
        </span>
      </div>
      <button type="submit" class="auth-button">{{props.authName == 'register' ? 'Register' : 'Login'}}</button>
      <p class="auth-link">Click <a @click="goTo">here</a> to {{props?.authName == 'register' ? 'login' : 'register'}}</p>
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
}

.title {
  font-size: 24px;
  margin-bottom: 20px;
}

.input-group {
  width: 100%;
  margin-bottom: 15px;
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  color: #93c5fd;
}

.password-toggle:hover {
  cursor: pointer;
}

.input-label {
  font-size: 16px;
}

.input-field {
  box-sizing: border-box;
  width: 100%;
  height: 40px;
  border: 1px solid #93c5fd;
  border-radius: 4px;
  font-size: 16px;
  padding: 5px;
}

.input-field:focus {
  outline: currentColor;
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