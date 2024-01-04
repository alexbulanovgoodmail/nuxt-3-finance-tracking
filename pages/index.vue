<script setup lang="ts">
import type Transaction from '~/interfaces/Transaction'

import { transactionViewOptions } from '~/constants'
const selectedView = ref(transactionViewOptions[0])

const supabase = useSupabaseClient()

const { data, pending } = await useAsyncData('transactions', async () => {
	const { data, error } = await supabase.from('transactions').select()

	if (error) return []

	return data
})

const transactions = ref<Transaction[] | null>([])

transactions.value = data.value
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
				:amount="4000"
				:last-amount="3000"
				:loading="false"
			/>
			<Trend
				color="red"
				title="Expense"
				:amount="4000"
				:last-amount="5000"
				:loading="false"
			/>
			<Trend
				color="green"
				title="Investments"
				:amount="4000"
				:last-amount="3000"
				:loading="false"
			/>
			<Trend
				color="green"
				title="Saving"
				:amount="4000"
				:last-amount="4100"
				:loading="false"
			/>
		</section>

		<section>
			<Transaction
				v-for="transaction in transactions"
				:key="transaction.id"
				:transaction="transaction"
			/>
		</section>
	</div>
</template>
