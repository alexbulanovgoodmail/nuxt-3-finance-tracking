<script setup lang="ts">
const success = ref<boolean>(false)
const email = ref<string>('')
const pending = ref<boolean>(false)

const { toastError } = useAppToast()
const supabase = useSupabaseClient()

useRedirectIfAuthenticated()

const redirectUrl = useRuntimeConfig().public.baseUrl

const handleLogin = async () => {
	pending.value = true

	try {
		const { error } = await supabase.auth.signInWithOtp({
			email: email.value,
			options: {
				emailRedirectTo: `${redirectUrl}/confirm`
			}
		})

		if (error) {
			toastError({
				title: 'Error authenticating',
				description: error.message
			})
		} else {
			success.value = true
		}
	} finally {
		pending.value = false
	}
}
</script>

<template>
	<div>
		<UCard v-if="!success">
			<template #header> Sign-in to Finance Tracker</template>

			<form @submit.prevent="handleLogin">
				<UFormGroup
					class="mb-4"
					label="Email"
					name="email"
					:required="true"
					help="You will receive an email with the confirmation link"
				>
					<UInput v-model="email" type="email" placeholder="Email" required />
				</UFormGroup>
				<UButton
					label="Sign-in"
					variant="solid"
					color="black"
					type="submit"
					:loading="pending"
					:disabled="pending"
				/>
			</form>
		</UCard>

		<UCard v-else>
			<template #header> Email has been sent </template>

			<div class="text-center">
				<p class="mb-4">
					We have sent an email to <strong>{{ email }}</strong> with a link to
					sing-in
				</p>
				<p><strong>Important: </strong> The link will expire in 5 minuts.</p>
			</div>
		</UCard>
	</div>
</template>
