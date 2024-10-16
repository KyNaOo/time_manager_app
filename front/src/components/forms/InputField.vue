
<script setup lang="ts">
import { ref, defineProps } from 'vue';
import { useValidators } from '@/api/validators';
import FieldLayout from './FieldLayout.vue';

const validators = useValidators();

const error = ref<string | null>(null);

const props = defineProps<{
    type: 'text' | 'password' | 'email';
    name: string;
    label: string;
    required: boolean;
}>();

const validateInput = () => {
    if (!inputValue.value) {
        error.value = 'Input is required';
        return;
    }
    if (!props.name) {
        console.error('No name prop provided');
        error.value = 'No name prop provided';
        return;
    }
    if (props.name === 'email'){
        console.log('Email validation');
        const validated = validators.validateEmail(inputValue.value);
        if (!validated) {
            error.value = 'Invalid email';
            return;
        }
    }
    if (props.name === 'username'){
        console.log('Username validation');
        const validated = validators.validateUsername(inputValue.value);
        if (!validated) {
            error.value = 'Invalid username';
            return;
        }
    }
    error.value = null;
};

const inputValue = ref('');
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

label {
    display: block;
    margin-bottom: 0.5rem;
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
  outline: red;
}

.error {
    color: red;
}
</style>
