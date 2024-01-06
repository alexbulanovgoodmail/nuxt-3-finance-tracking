<script setup lang="ts">
import type Transaction from '~/interfaces/Transaction'
import { transactionViewOptions } from '~/constants'

type Group = {
	[date: string]: Transaction[]
}

const selectedView = ref(transactionViewOptions[0])
const supabase = useSupabaseClient()
const transactions = ref<Transaction[] | null>([])
const isLoading = ref<boolean>(false)
const isOpen = ref<boolean>(false)

const income = computed(() => {
	if (transactions.value !== null) {
		return transactions.value.filter(t => t.type === 'Income')
	} else {
		return []
	}
})
const expense = computed(() => {
	if (transactions.value !== null) {
		return transactions.value.filter(t => t.type === 'Expense')
	} else {
		return []
	}
})

const incomeCount = computed(() => income.value.length)
const expenseCount = computed(() => expense.value.length)

const incomeTotal = computed(() =>
	income.value.reduce((sum, t) => (sum += sum + t.amount), 0)
)
const expenseTotal = computed(() =>
	income.value.reduce((sum, t) => (sum += sum + t.amount), 0)
)

const fetchTransactions = async () => {
	isLoading.value = true

	try {
		const { data } = await useAsyncData('transactions', async () => {
			const { data, error } = await supabase
				.from('transactions')
				.select()
				.order('created_at', { ascending: false })

			if (error) return []

			return data
		})

		return data.value
	} finally {
		isLoading.value = false
	}
}

const refreshTransactions = async () =>
	(transactions.value = await fetchTransactions())

await refreshTransactions()

const transactionsGroupedByDate = computed(() => {
	const grouped: Group = {}

	if (transactions.value !== null) {
		for (const transaction of transactions.value) {
			const date = new Date(transaction.created_at).toISOString().split('T')[0]

			if (!grouped[date]) {
				grouped[date] = []
			}

			grouped[date].push(transaction)
		}
	}

	// Example of sorting on the client

	// const sortedKeys = Object.keys(grouped).sort().reverse()
	// const sortedGrouped = {}

	// for (const key of sortedKeys) {
	// 	sortedGrouped[key] = grouped[key]
	// }

	// return sortedGrouped
	return grouped
})
</script>

<template>
	<div>
		<section class="mb-10 flex items-center justify-between">
			<h1 class="text-4xl font-extrabold">Summary</h1>
			<div>
				<USelectMenu v-model="selectedView" :options="transactionViewOptions" />
			</div>
		</section>

		<section
			class="mb-10 grid grid-cols-1 sm:grid-cols-2 sm:gap-16 lg:grid-cols-4"
		>
			<Trend
				color="green"
				title="Income"
				:amount="incomeTotal"
				:last-amount="3000"
				:loading="isLoading"
			/>
			<Trend
				color="red"
				title="Expense"
				:amount="expenseTotal"
				:last-amount="5000"
				:loading="isLoading"
			/>
			<Trend
				color="green"
				title="Investments"
				:amount="4000"
				:last-amount="3000"
				:loading="isLoading"
			/>
			<Trend
				color="green"
				title="Saving"
				:amount="4000"
				:last-amount="4100"
				:loading="isLoading"
			/>
		</section>

		<section class="mb-10 flex justify-between">
			<div>
				<h2 class="text-2xl font-extrabold">Transactions</h2>
				<div class="text-gray-500 dark:text-gray-400">
					You have {{ incomeCount }} incomes and {{ expenseCount }} expense this
					period
				</div>
			</div>
			<div>
				<TransactionModal v-model="isOpen" />

				<UButton
					icon="i-heroicons-plus-circle"
					color="white"
					variant="solid"
					label="Add"
					@click="isOpen = true"
				/>
			</div>
		</section>

		<section v-if="!isLoading">
			<div
				v-for="(transactionsOnDay, date) in transactionsGroupedByDate"
				:key="date"
				class="mb-10"
			>
				<DailyTransactionSummary
					:date="date.toString()"
					:transactions="transactionsOnDay"
				/>
				<Transaction
					v-for="transaction in transactionsOnDay"
					:key="transaction.id"
					:transaction="transaction"
					@deleted="refreshTransactions"
				/>
			</div>
		</section>
		<section v-else>
			<USkeleton v-for="i in 4" :key="i" class="mb-2 h-8 w-full" />
		</section>
	</div>
</template>
