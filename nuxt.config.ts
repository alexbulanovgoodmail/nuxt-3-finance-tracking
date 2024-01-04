// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },

	modules: [
		'@nuxtjs/eslint-module',
		'@nuxtjs/stylelint-module',
		'@nuxt/ui',
		'@nuxtjs/supabase'
	],

	eslint: {
		failOnError: true
	},

	supabase: {
		redirect: false
	}
})
