<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { categories, types } from '~/constants'
import type Transaction from '~/interfaces/Transaction'

interface Props {
	modelValue: boolean
	transaction?: Transaction
}

const isEditing = computed(() => !!props.transaction)

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

const initialState: State = isEditing.value
	? {
			type: props.transaction?.type || undefined,
			amount: props.transaction?.amount || 0,
			created_at: props.transaction?.created_at.split('T')[0] || undefined,
			description: props.transaction?.description || undefined,
			category: props.transaction?.category || undefined
		}
	: {
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
const { toastSuccess, toastError } = useAppToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
	if (form.value && form.value.errors.length) return
	try {
		isLoading.value = true

		const { error } = await supabase.from('transactions').upsert({
			...state.value,
			id: props.transaction?.id
		})

		if (!error) {
			toastSuccess({
				title: 'Transaction saved'
			})
			isOpen.value = false
			emits('saved')
			return
		}

		throw error
	} catch (e: any) {
		toastError({
			title: 'Transaction not saved',
			description: e.message
		})
	} finally {
		isLoading.value = false
	}
}
</script>

<template>
	<UModal v-model="isOpen">
		<UCard>
			<template #header>
				{{ isEditing ? 'Edit' : 'Add' }} Transaction
			</template>

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
						:disabled="isEditing"
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
