<script>

import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import { useMetamaskStore } from './stores/metamask.js'

export default {

	mounted () {
		let metamaskStore = useMetamaskStore()
		if (metamaskStore.isMetamaskInstalled()) {
			window.ethereum.on('connected', () => {
				console.log('connected')
			})
			window.ethereum.on('disconnect', () => {
				console.log('disconnect')
			})
			window.ethereum.on('message', () => {
				console.log('message')
			})
			window.ethereum.on('accountsChanged', accounts => {
				metamaskStore.handleAccountsChanged(accounts)
				console.log('accountsChanged')
				console.log(accounts)
			})
			window.ethereum.on('chainChanged', () => {
				console.log('chainChanged')
			})
		}

		metamaskStore.assignStates()
	},

	components: {
		NavBar,
		RouterView
	}

}

</script>




<template>

	<section class="section">
		<div class="container">

			<NavBar />

			<hr>

			<RouterView />

		</div>
	</section>

</template>




<style scoped>

</style>
