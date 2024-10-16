<script setup lang="ts">
import { ref, defineProps } from 'vue';

import { store } from '../../api/store';
const props = defineProps<{
    title: string;
    message: string;
}>();

const isVisible = ref(true);

import { defineEmits } from 'vue';

const emit = defineEmits(['close', 'confirm']);

function closeModal() {
    isVisible.value = false;
    emit('close');
}

function confirmAction() {
    console.log('Action confirmed');
    emit('confirm');
    closeModal();
}

</script>


<template>
    <div class="modal" v-if="isVisible" @click.self="closeModal">
        <div class="modal-content">
            <span class="close" @click="closeModal">&times;</span>
            <h2>{{ title }}</h2>
            <p>{{ message }}</p>
            <div class="modal-actions">
                <button class="cancel" @click="closeModal">Cancel</button>
                <button class="confirm" @click="confirmAction">Confirm</button>
            </div>
        </div>
    </div>

</template>


<style scoped>
.modal {
    display: block;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0,0,0,0.2);
}

.modal-content {
    position: relative;
    background-color: #fefefe;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width:400px;
    border-radius: 8px;
}

.modal-actions {
    display: flex;
    justify-content: space-between;
}

.modal-actions button {
    padding: 10px;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.cancel {
    background-color: #f44336;
}   

.confirm {
    background-color: #4CAF50;
}

.close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
    position: absolute;
    right: 10px;
    top: 0;
}

.close:hover,
.close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
}
</style>
