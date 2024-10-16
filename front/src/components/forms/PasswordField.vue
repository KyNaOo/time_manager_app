<script setup lang="ts">
import { ref , shallowRef} from 'vue';
import { useValidators } from '@/api/validators';
import FieldLayout from './FieldLayout.vue';


const props = defineProps<{
    name: string;
    label: string;
}>();

const showPassword = shallowRef(false);
const password = ref('');
const error = ref<any | null>(null);
const validators = useValidators();

const validatePassword = () => {
    const validationResult = validators.strongPassword(password.value);
    error.value = validationResult 
};
</script>

<template>
    <FieldLayout :name="props.name" :label="props.label">
        <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            v-model="password"
            class="password-field"
            @input="validatePassword"
        />
        <span class="password-toggle" @click="showPassword = !showPassword">
            {{ showPassword ? "Hide" : "Show" }}
        </span>
        <ul v-if="error" class="error-list">
            <li :class="!error.minLength ? 'show' : 'hide'">Password must be at least 12 characters long</li>
            <li :class="!error.hasUpperCase ? 'show' : 'hide'">Password must contain at least one uppercase letter</li>
            <li :class="!error.hasLowerCase ? 'show' : 'hide'">Password must contain at least one lowercase letter</li>
            <li :class="!error.hasNumber ? 'show' : 'hide'">Password must contain at least one number</li>
            <li :class="!error.hasSpecialChar ? 'show' : 'hide'">Password must contain at least one special character</li>
        </ul>
    </FieldLayout>
</template>

<style scoped>
/* Add your styles here */
.password-field {
  box-sizing: border-box;
  width: 100%;
  height: 40px;
  border: 1px solid #93c5fd;
  border-radius: 4px;
  font-size: 16px;
  padding: 5px;
  position: relative;
}


.password-toggle {
  /* position: absolute;
  right: 40px;
  top: 50%; */
  color: #93c5fd;
}

.show {
    color: red;
}

.hide {
    color: green;
}

.password-toggle:hover {
  cursor: pointer;
}
.error {
    color: red;
}
</style>