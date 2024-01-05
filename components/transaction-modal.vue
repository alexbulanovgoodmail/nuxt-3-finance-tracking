<script setup lang="ts">
import { categories, types } from '~/constants'
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

			<UFormGroup
				class="mb-4"
				label="Transaction type"
				name="type"
				:required="true"
			>
				<USelect placeholder="Select the transaction type" :options="types" />
			</UFormGroup>

			<UFormGroup class="mb-4" label="Amount" name="amount" :required="true">
				<UInput type="number" placeholder="Amount" />
			</UFormGroup>
			<UFormGroup
				class="mb-4"
				label="Transaction date"
				name="created_at"
				:required="true"
			>
				<UInput type="date" icon="i-heroicons-calendar-days-20-solid" />
			</UFormGroup>
			<UFormGroup
				class="mb-4"
				label="Description"
				name="description"
				hint="Optional"
			>
				<UInput placeholder="Description" />
			</UFormGroup>
			<UFormGroup
				class="mb-4"
				label="Category"
				name="category"
				:required="true"
			>
				<USelect placeholder="Category" :options="categories" />
			</UFormGroup>

			<UButton type="submit" color="black" variant="solid" label="Save" />
		</UCard>
	</UModal>
</template>
