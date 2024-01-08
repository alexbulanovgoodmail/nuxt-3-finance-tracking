<script setup lang="ts">
import { z } from 'zod'

interface State {
	name: string
	email: string | undefined
}

interface Data {
	data: {
		full_name: string
	}
	email?: string
}

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { toastError, toastSuccess } = useAppToast()

const pending = ref<boolean>(false)

const state = ref<State>({
	name: user.value?.user_metadata.full_name || '',
	email: user.value?.email
})

const schema = z.object({
	name: z.string().min(2).optional(),
	email: z.string().email()
})

const saveProfile = async () => {
	pending.value = true

	try {
		const data: Data = {
			data: {
				full_name: state.value.name
			}
		}

		if (state.value.email !== user.value?.email) {
			data.email = state.value.email
		}

		const { error } = await supabase.auth.updateUser(data)

		if (error) {
			throw error
		}

		toastSuccess({
			title: 'Profile update',
			description: 'Your profile has been updated'
		})
	} catch (error: any) {
		toastError({
			title: 'Error update profile',
			description: error.message
		})
	} finally {
		pending.value = false
	}
}
</script>

<template>
	<div>
		<UForm :state="state" :schema="schema" @submit="saveProfile">
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
