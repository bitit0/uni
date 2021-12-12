<script setup lang="ts">
import { ref } from "vue"

const props = defineProps<{
    title: string
    modelValue: boolean
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', show: false): void,
    (e: 'input', value: string): void
}>()

const value = ref('')

const cancel = () => {
    emit('update:modelValue', false)
}
const confirm = () => {
    emit('input', value.value)
    emit('update:modelValue', false)
}
</script>

<template>
    <transition name="pop">
        <div class="modal" v-show="modelValue">
            <div class="dialog">
                <div>
                    <b>{{ title }}</b>
                </div>
                <textarea placeholder="uni://" v-model="value" />
                <div class="btns">
                    <div class="button" @click="cancel">取消</div>
                    <div class="button" @click="confirm">确认</div>
                </div>
            </div>
        </div>
    </transition>
</template>

<style scoped>
.modal {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}
.dialog {
    background-color: #f0f0f0;
    padding: 20px;
    width: 420px;
    max-width: 90%;
    border-radius: 5px;
    box-shadow: 0 0 4px 0 #0007;
}
.dialog > *:not(:first-child) {
    margin-top: 10px;
}
textarea {
    resize: none;
    width: 100%;
    height: 120px;
    border: none;
    border-radius: 3px;
    background-color: white;
    padding: 10px 20px;
    box-shadow: 0 0 2px 0 #0007;
}
.btns {
    display: flex;
    justify-content: end;
}
.btns > * {
    margin-left: 10px;
}
.button {
    display: inline-flex;
    height: 28px;
    background-color: #0076a8;
    box-shadow: 0 0 2px 0 #0007;
    border-radius: 3px;
    align-items: center;
    user-select: none;
    padding: 0 10px;
    color: white;
    cursor: pointer;
}
.button:hover {
    filter: brightness(1.2);
}
.pop-enter-active,
.pop-leave-active {
    transition: all 200ms ease;
}
.pop-enter-from,
.pop-leave-to {
    opacity: 0;
    transform: scale(0.9);
}
</style>