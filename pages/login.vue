<script setup lang="ts">
const success = ref<boolean>(false)
</script>

<template>
	<UCard v-if="!success">
		<template #header> Sign-in to Finance Tracker</template>

		<form>
			<UFormGroup
				class="mb-4"
				label="Email"
				name="email"
				:required="true"
				help="You will receive an email with the confirmation link"
			>
				<UInput type="email" placeholder="Email" required />
			</UFormGroup>
			<UButton
				label="Sign-in"
				variant="solid"
				color="black"
				type="submit"
				@click.prevent="success = true"
			/>
		</form>
	</UCard>

	<UCard v-else>
		<template #header> Email has been sent </template>

		<div class="text-center">
			<p class="mb-4">
				We have sent an email to <strong>email@yandex.ru</strong> with a link to
				sing-in
			</p>
			<p><strong>Important: </strong> The link will expire in 5 minuts.</p>
		</div>
	</UCard>
</template>
