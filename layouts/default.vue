<script setup lang="ts">
// Link to Google Fonts
useHead({
	link: [
		{
			rel: 'preconnect',
			href: 'https://fonts.googleapis.com'
		},
		{
			rel: 'stylesheet',
			href: 'https://fonts.googleapis.com/css2?family=Inter&display=swap',
			crossorigin: ''
		}
	]
})
</script>

<template>
	<div class="container mx-auto max-w-4xl">
		<AppHeader />
		<main class="my-10">
			<slot />
		</main>
	</div>
</template>

<style>
body {
	@apply dark:bg-gray-900 bg-white;

	font-family: 'Inter', sans-serif;
}
</style>
