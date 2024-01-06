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
	(e: 'saved'): void
}>()

const isOpen = computed({
	get: () => props.modelValue,
	set: value => {
		if (!value) resetForm()
		emits('update:modelValue', value)
	}
})

interface State {
	type: undefined | string
	amount: number
	created_at: undefined | string
	description: undefined | string
	category: undefined | string
}

const form = ref<any>(null)

const initialState: State = {
	type: undefined,
	amount: 0,
	created_at: undefined,
	description: undefined,
	category: undefined
}

const state = ref<State>({ ...initialState })

const defaultSchema = z.object({
	amount: z.number().positive('Amount needs to be more than 0'),
	created_at: z.string(),
	description: z.string().optional()
})

const resetForm = () => {
	Object.assign(state.value, initialState)

	if (form.value) form.value.clear()
}

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
const isLoading = ref<boolean>(false)
const supabase = useSupabaseClient()
const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
	if (form.value && form.value.errors.length) return
	try {
		isLoading.value = true

		const { error } = await supabase
			.from('transactions')
			.upsert({ ...state.value })

		if (!error) {
			toast.add({
				title: 'Transaction saved',
				icon: 'i-heroicons-check-circle'
			})
			isOpen.value = false
			emits('saved')
			return
		}

		throw error
	} catch (e: any) {
		toast.add({
			title: 'Transaction not saved',
			description: e.message,
			icon: 'i-heroicons-exclamation-circle',
			color: 'red'
		})
	} finally {
		isLoading.value = false
	}
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

				<UButton
					type="submit"
					color="black"
					variant="solid"
					label="Save"
					:loading="isLoading"
				/>
			</UForm>
		</UCard>
	</UModal>
</template>
