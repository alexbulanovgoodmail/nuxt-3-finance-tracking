export default interface Transaction {
	id: number
	created_at: string
	amount: number
	type: string
	description: string
	category: null | string
}
