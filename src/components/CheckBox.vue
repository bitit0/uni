<script setup lang="ts">
const props = defineProps<{
    value: boolean
}>()
const emit = defineEmits<{
    (e: 'change', value: boolean): void
}>()
const click = (e: MouseEvent) => {
    emit('change', (e.target as HTMLInputElement).checked)
}
</script>

<template>
    <input type="checkbox" @click="click" :checked="value" />
</template>