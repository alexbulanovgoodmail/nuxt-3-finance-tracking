<script setup lang="ts">
import { transactionViewOptions } from '~/constants'

const selectedView = ref(transactionViewOptions[1])
const isOpen = ref<boolean>(false)

const { current, previous } = useSelectedTimePeriod(selectedView)

const {
	pending,
	refresh,
	transactions: {
		incomeCount,
		expenseCount,
		incomeTotal,
		expenseTotal,
		grouped: { byDate }
	}
} = useFetchTransactions(current)

const {
	refresh: refreshPrevious,
	transactions: { incomeTotal: prevIncomeTotal, expenseTotal: prevExpenseTotal }
} = useFetchTransactions(previous)

await refresh()
await refreshPrevious()
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
				:last-amount="prevIncomeTotal"
				:loading="pending"
			/>
			<Trend
				color="red"
				title="Expense"
				:amount="expenseTotal"
				:last-amount="prevExpenseTotal"
				:loading="pending"
			/>
			<Trend
				color="green"
				title="Investments"
				:amount="4000"
				:last-amount="3000"
				:loading="pending"
			/>
			<Trend
				color="green"
				title="Saving"
				:amount="4000"
				:last-amount="4100"
				:loading="pending"
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
				<TransactionModal v-model="isOpen" @saved="refresh()" />

				<UButton
					icon="i-heroicons-plus-circle"
					color="white"
					variant="solid"
					label="Add"
					@click="isOpen = true"
				/>
			</div>
		</section>

		<section v-if="!pending">
			<div
				v-for="(transactionsOnDay, date) in byDate"
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
					@deleted="refresh()"
				/>
			</div>
		</section>
		<section v-else>
			<USkeleton v-for="i in 4" :key="i" class="mb-2 h-8 w-full" />
		</section>
	</div>
</template>
