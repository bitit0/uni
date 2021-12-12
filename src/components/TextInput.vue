<script setup lang="ts">
const props = defineProps<{
    value: string
}>()
const emit = defineEmits<{
    (e: 'change', value: string): void
}>()
const change = (e: Event) => {
    emit('change', (e.target as HTMLInputElement).value)
}
</script>

<template>
    <input type="text" :value="value" @change="change" />
</template>

<style scoped>
input {
    border: none;
    background: none;
    font-size: 16px;
    color: #333;
}
</style>