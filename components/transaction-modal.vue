<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
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

interface State {
	type: string
	amount: number
	created_at: undefined | string
	description: undefined | string
	category: undefined | string
}

const form = ref<null | HTMLElement>(null)

const state = ref<State>({
	type: 'Income',
	amount: 0,
	created_at: undefined,
	description: undefined,
	category: undefined
})

const defaultSchema = z.object({
	amount: z.number().positive('Amount needs to be more than 0'),
	created_at: z.string(),
	description: z.string().optional()
})

const incomeSchema = z.object({
	type: z.literal('Income')
})

const expenseSchema = z.object({
	type: z.literal('Expense'),
	category: z.enum(categories)
})

const investmentSchema = z.object({
	type: z.literal('Investment')
})

const savingSchema = z.object({
	type: z.literal('Saving')
})

const schema = z.intersection(
	z.discriminatedUnion('type', [
		incomeSchema,
		expenseSchema,
		savingSchema,
		investmentSchema
	]),
	defaultSchema
)

type Schema = z.output<typeof schema>

async function onSubmit(event: FormSubmitEvent<Schema>) {
	// Do something with data
	await console.log(event.data)
}
</script>

<template>
	<UModal v-model="isOpen">
		<UCard>
			<template #header> Add Transaction </template>

			<UForm ref="form" :schema="schema" :state="state" @submit="onSubmit">
				<UFormGroup
					class="mb-4"
					label="Transaction type"
					name="type"
					:required="true"
				>
					<USelect
						v-model="state.type"
						placeholder="Select the transaction type"
						:options="types"
					/>
				</UFormGroup>

				<UFormGroup class="mb-4" label="Amount" name="amount" :required="true">
					<UInput
						v-model.number="state.amount"
						type="number"
						placeholder="Amount"
					/>
				</UFormGroup>

				<UFormGroup
					class="mb-4"
					label="Transaction date"
					name="created_at"
					:required="true"
				>
					<UInput
						v-model="state.created_at"
						type="date"
						icon="i-heroicons-calendar-days-20-solid"
					/>
				</UFormGroup>

				<UFormGroup
					class="mb-4"
					label="Description"
					name="description"
					hint="Optional"
				>
					<UInput v-model="state.description" placeholder="Description" />
				</UFormGroup>

				<UFormGroup
					v-if="state.type === 'Expense'"
					class="mb-4"
					label="Category"
					name="category"
					:required="true"
				>
					<USelect
						v-model="state.category"
						placeholder="Category"
						:options="categories"
					/>
				</UFormGroup>

				<UButton type="submit" color="black" variant="solid" label="Save" />
			</UForm>
		</UCard>
	</UModal>
</template>
