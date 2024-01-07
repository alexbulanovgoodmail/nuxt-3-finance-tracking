<script setup lang="ts">
useRedirectIfAuthenticated()
</script>

<template>
	<div>
		<UCard>
			<template #header> Signing in... </template>

			Wait a moment while sign you in...
		</UCard>
	</div>
</template>
