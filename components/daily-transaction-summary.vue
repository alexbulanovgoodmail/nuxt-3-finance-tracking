<script setup lang="ts">
import type Transaction from '~/interfaces/Transaction'

interface Props {
	date: string
	transactions: Transaction[]
}

const props = defineProps<Props>()

const sum = computed(() => {
	let sum = 0

	for (const transaction of props.transactions) {
		if (transaction.type === 'Income') {
			sum += transaction.amount
		} else {
			sum -= transaction.amount
		}
	}

	return sum
})

const { currency } = useCurrency(sum)
</script>

<template>
	<div
		class="grid grid-cols-2 py-4 text-gray-500 border-b font-bold border-gray-200 dark:border-gray-800 dark:text-gray-400"
	>
		<div class="flex items-center justify-between">
			{{ date }}
		</div>

		<div class="flex items-center justify-end mr-10">{{ currency }}</div>
	</div>
</template>
