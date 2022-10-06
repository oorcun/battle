<script>

import { RouterView } from 'vue-router'
import { mapState, mapActions } from 'pinia'
import NavBar from './components/NavBar.vue'
import { useMetamaskStore } from './stores/metamask.js'
import { useWeb3Store } from './stores/web3.js'
import { usePlayerStore } from './stores/player.js'

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
			window.ethereum.on('accountsChanged', () => {
				window.location.reload()
				console.log('accountsChanged')
			})
			window.ethereum.on('chainChanged', () => {
				window.location.reload()
				console.log('chainChanged')
			})
		}

		metamaskStore.assignStates()
		web3Store.assignStates()
	},

	computed: {
		...mapState(useMetamaskStore, ['metamaskState']),
		...mapState(usePlayerStore, ['playerState', 'attacks']),
	},

	methods: {
		...mapActions(useWeb3Store, ['getPlayer']),
		...mapActions(usePlayerStore, ['setFinishedAttacks', 'listenAttacks'])
	},

	watch: {
		metamaskState (newMetamaskState) {
			if (newMetamaskState === 'connected') {
				this.getPlayer()
			}
		},
		playerState (newPlayerState) {
			if (newPlayerState === 'exist') {
				this.setFinishedAttacks()
				this.listenAttacks()
			}
		}
	},

	components: {
		NavBar,
		RouterView
	}

}

</script>




<template>
{{attacks}}
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
