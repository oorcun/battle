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
			window.ethereum.on('accountsChanged', () => {
				window.location.reload()
			})
			window.ethereum.on('chainChanged', () => {
				window.location.reload()
			})
		}

		metamaskStore.assignStates()
		web3Store.assignStates()
	},

	unmounted () {
		this.unlistenAttacks()
	},

	computed: {
		...mapState(useMetamaskStore, ['metamaskState']),
		...mapState(usePlayerStore, ['playerState', 'attacks', 'attacksState']),
	},

	methods: {
		...mapActions(useWeb3Store, ['getPlayer']),
		...mapActions(usePlayerStore, ['setFinishedAttacks', 'listenAttacks', 'unlistenAttacks'])
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

	<section class="section">
		<div class="container">

			<NavBar />

			<hr>

			<div v-if="attacksState === 'error'" class="notification is-danger">
				Error on attacks fetching, please check console.
			</div>

			<RouterView />

		</div>
	</section>

</template>




<style scoped>

</style>
