<script setup lang="ts">
interface Props {
	modelValue: boolean
}

const props = defineProps<Props>()
const emits = defineEmits<{
	(e: 'update:modelValue', value: boolean): void
}>()

const isOpen = computed({
	get: () => props.modelValue,
	set: value => emits('update:modelValue', value)
})
</script>

<template>
	<UModal v-model="isOpen">
		<UCard>
			<template #header> Add Transaction </template>

			<div>Hello</div>
		</UCard>
	</UModal>
</template>
