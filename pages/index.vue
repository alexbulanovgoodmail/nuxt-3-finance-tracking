<script setup lang="ts">
import { transactionViewOptions } from '~/constants'

const selectedView = ref(transactionViewOptions[0])
</script>

<template>
	<section class="mb-10 flex items-center justify-between">
		<h1 class="text-4xl font-extrabold">Summary</h1>
		<div>
			<USelectMenu v-model="selectedView" :options="transactionViewOptions" />
		</div>
	</section>
</template>
