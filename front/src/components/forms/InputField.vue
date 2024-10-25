<script setup lang="ts">
import { ref, defineProps, watch } from 'vue';
import { useValidators } from '@/api/validators';
import FieldLayout from './FieldLayout.vue';

const validators = useValidators();

const error = ref<string | null>(null);
// const isFormValid = ref(true);

const emit = defineEmits(['update:modelValue', 'form-validity']);

const props = defineProps<{
    type: 'text' | 'password' | 'email';
    name: string;
    label: string;
    required: boolean;
}>();

const fieldContext = ref({
    name : props.name,
    isValid : false
});

const inputValue = ref('');


const validateInput = () => {
    if (!inputValue.value) {
        error.value = 'Input is required';
        fieldContext.value.isValid = false;
    }
    if (!props.name) {
        console.error('No name prop provided');
        error.value = 'No name prop provided';
        fieldContext.value.isValid = false;
    }
    if (props.name === 'email') {
        const validated = validators.validateEmail(inputValue.value);
        if (!validated) {
            error.value = 'Invalid email';
            fieldContext.value.isValid= false;
        } else {
            fieldContext.value.isValid = true;

        }

    }
    if (props.name === 'username') {
        const validated = validators.validateUsername(inputValue.value);
        if (!validated) {
            error.value = 'Invalid username';
            fieldContext.value.isValid = false;
        } else {
            fieldContext.value.isValid = true;
        }

    }
    error.value = null;
    // fieldContext.value.isValid = true; 
    emit('form-validity', fieldContext.value); 
    return;

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
label {
    display: block;
    margin-bottom: 0.5rem;
}

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
    outline: red;
}

.error {
    color: red;
}
</style>
