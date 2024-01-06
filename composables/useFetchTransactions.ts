import type Transaction from '~/interfaces/Transaction'
type Group = {
	[date: string]: Transaction[]
}

export const useFetchTransactions = () => {
	const supabase = useSupabaseClient()

	const pending = ref<boolean>(false)
	const transactions = ref<Transaction[] | null>([])

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
		pending.value = true

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
			pending.value = false
		}
	}

	const refresh = async () => (transactions.value = await fetchTransactions())

	const transactionsGroupedByDate = computed(() => {
		const grouped: Group = {}

		if (transactions.value !== null) {
			for (const transaction of transactions.value) {
				const date = new Date(transaction.created_at)
					.toISOString()
					.split('T')[0]

				if (!grouped[date]) {
					grouped[date] = []
				}

				grouped[date].push(transaction)
			}
		}
		return grouped
	})

	return {
		transactions: {
			all: transactions,
			grouped: {
				byDate: transactionsGroupedByDate
			},
			income,
			expense,
			incomeCount,
			expenseCount,
			incomeTotal,
			expenseTotal
		},
		refresh,
		pending
	}
}
