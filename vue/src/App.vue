<script>

import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import { useMetamaskStore } from './stores/metamask.js'
import { useWeb3Store } from './stores/web3.js'

export default {

	mounted () {
		const metamaskStore = useMetamaskStore()
		const web3Store = useWeb3Store()

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
		web3Store.assignStates()
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
