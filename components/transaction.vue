<script setup lang="ts">
import type Transaction from '~/interfaces/Transaction'

interface Props {
	transaction: Transaction
}

const props = defineProps<Props>()

const isIncome = computed(() => props.transaction.type === 'Income')

const icon = computed(() =>
	isIncome.value ? 'i-heroicons-arrow-up-right' : 'i-heroicons-arrow-down-left'
)
const iconColor = computed(() =>
	isIncome.value ? 'text-green-600' : 'text-red-600'
)

const { currency } = useCurrency(props.transaction.amount)

const isLoading = ref<boolean>(false)
const toast = useToast()
const supabase = useSupabaseClient()

const deleteTransaction = async () => {
	isLoading.value = true

	try {
		await supabase.from('transactions').delete().eq('id', props.transaction.id)

		toast.add({
			title: 'Transaction deleted',
			icon: 'i-heroicons-check-circle',
			color: 'green'
		})
	} catch (error) {
		toast.add({
			title: 'Transaction deleted',
			icon: 'i-heroicons-exclamation-circle',
			color: 'red'
		})
	} finally {
		isLoading.value = false
	}
}

const items = [
	[
		{
			label: 'Edit',
			icon: 'i-heroicons-pencil-square-20-solid',
			click: () => console.log('Edit')
		},
		{
			label: 'Delete',
			icon: 'i-heroicons-trash-20-solid',
			click: deleteTransaction
		}
	]
]
</script>

<template>
	<div
		class="grid grid-cols-2 py-4 text-gray-900 border-b border-gray-200 dark:border-gray-800 dark:text-gray-100"
	>
		<div class="flex items-center justify-between">
			<div class="flex items-center space-x-1">
				<UIcon :name="icon" :class="[iconColor]" />
				<div>{{ transaction.description }}</div>
			</div>
			<div>
				<UBadge v-if="transaction.category" color="white">{{
					transaction.category
				}}</UBadge>
			</div>
		</div>

		<div class="flex items-center justify-end space-x-2">
			<div>{{ currency }}</div>
			<div>
				<UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
					<UButton
						color="white"
						variant="ghost"
						trailing-icon="i-heroicons-ellipsis-horizontal"
						:loading="isLoading"
					/>
				</UDropdown>
			</div>
		</div>
	</div>
</template>
