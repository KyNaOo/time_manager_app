<script setup lang="ts">
import { ref, defineProps, watch } from 'vue';
import FieldLayout from './FieldLayout.vue';

const emit = defineEmits(['update:modelValue', 'form-validity']);

const props = defineProps<{
  type: 'text' | 'password' | 'email';
  name: string;
  label: string;
  required: boolean;
}>();

const inputValue = ref('');
const error = ref<string | null>(null);
const isValid = ref(false);

const validateEmail = (email: string): boolean => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

const detectInjection = (input: string): boolean => {
  const dangerousPatterns = [
    /<script.*?>.*?<\/script>/gi, 
    /\b(on\w+=|javascript:|alert\(|eval\(|document\.cookie|window\.location)/gi, 
    /(--|\b(SELECT|UPDATE|DELETE|INSERT|DROP|ALTER|CREATE|TRUNCATE)\b)/gi, 
    /[<>;'"]/
  ];

  return dangerousPatterns.some((pattern) => pattern.test(input));
};

const validateInput = () => {
  if (!inputValue.value && props.required) {
    error.value = 'This field is required';
    isValid.value = false;
  }
  else if (props.name === 'email' && !validateEmail(inputValue.value)) {
    error.value = 'Invalid email address';
    isValid.value = false;
  }
  else if (detectInjection(inputValue.value)) {
    error.value = 'Input contains invalid characters';
    isValid.value = false;
  }
  else {
    error.value = null;
    isValid.value = true;
  }

  emit('form-validity', { name: props.name, isValid: isValid.value });
};

watch(inputValue, (newValue) => {
  emit('update:modelValue', newValue);
  validateInput();
});
</script>

<template>
  <FieldLayout :name="props.name" :label="props.label">
    <input
        :type="props.type"
        :name="props.name"
        v-model="inputValue"
        @input="validateInput"
        class="input-field"
    />
    <span class="error" v-if="error">{{ error }}</span>
  </FieldLayout>
</template>

<style scoped>
.input-field {
  box-sizing: border-box;
  width: 100%;
  height: 40px;
  border: 1px solid white;
  background-color: #353535;
  color: white;
  border-radius: 4px;
  font-size: 16px;
  padding: 5px;
}

.input-field:focus {
  outline: none;
  border-color: red;
}

.error {
  color: red;
  font-size: 12px;
}
</style>
