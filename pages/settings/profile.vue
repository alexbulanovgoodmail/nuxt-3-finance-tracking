<script setup lang="ts">
import { z } from 'zod'

interface State {
	name: string
	email: string | undefined
}

// const supabase = useSupabaseClient()
const user = useSupabaseUser()
// const { toastError, toastSuccess } = useAppToast()

const pending = ref<boolean>(false)

const state = ref<State>({
	name: '',
	email: user.value?.email
})

const schema = z.object({
	name: z.string().min(2).optional(),
	email: z.string().email()
})

function handleSubmit(params: type) {}
</script>

<template>
	<div>
		<UForm :state="state" :schema="schema" @submit="handleSubmit">
			<UFormGroup class="mb-4" label="Full Name" name="name">
				<UInput v-model="state.name" />
			</UFormGroup>
			<UFormGroup
				class="mb-4"
				label="Email"
				name="email"
				help="You will receive a confirmation email on both the old and the new addresses if you modify the email address"
			>
				<UInput v-model="state.email" />
			</UFormGroup>

			<UButton
				type="submit"
				variant="solid"
				color="black"
				label="Save"
				:disabled="pending"
				:loading="pending"
			/>
		</UForm>
	</div>
</template>
